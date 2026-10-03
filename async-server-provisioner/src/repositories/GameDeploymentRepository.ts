import MySqlAdapter from '../adapters/MySqlAdapter';
import { GameDeployment, gameDeploymentFactory } from '../entities/GameDeployment';
import { randomUUID } from 'node:crypto';
import { TerraformGSOutput } from '../services/TerraformService';
import { gqlQuery } from '../adapters/GraphQlAdapter';
import pino from 'pino';

const query = `
query($documentId: ID!) {
  gameDeployment(documentId: $documentId) {
    documentId
    status
    cloud_instance {
      api_name
      provider
      region
      cost_per_hour
    }
    game_instance {
      documentId
      name
      game_version {
        docker_image
        ports {
          name
          port
          type
        }
        backup_paths {
          name
          path
        }
      }
    }
  }
}
`;

export default class GameDeploymentRepository {
  constructor(
    private mysqlAdapter: MySqlAdapter,
    private dirtyMysqlAdapter: MySqlAdapter,
    private logger: pino.Logger
  ) {}

  public async getDeployment(): Promise<GameDeployment | null> {
    const uuid = randomUUID();

    await this.dirtyMysqlAdapter.beginTransaction();
    await this.dirtyMysqlAdapter.query(
      `
      UPDATE game_deployments
      SET consumer_uuid = ?
      WHERE id = (SELECT id FROM (SELECT id FROM game_deployments WHERE (status = 'STOPPING' or status = 'STARTING') and consumer_uuid IS NULL LIMIT 1) as temp)
    `,
      [uuid]
    );

    const rows = await this.dirtyMysqlAdapter.query(
      `
      SELECT gd.id as gd_id, gd.document_id as gd_document_id
      FROM game_deployments gd
      WHERE consumer_uuid = ?;
    `,
      [uuid]
    );

    if (rows.length === 0) {
      return null;
    }

    const res = await gqlQuery(this.logger, query, { documentId: rows[0].gd_document_id });
    const data = await res.json();
    if (data.errors && data.errors.length != 0) {
      this.logger.child({ errors: data.errors }).error('Failed to fetch game deployment data');
      return null;
    }
    const deployment = data.data.gameDeployment;
    // GraphQL exposes documentIds; Terraform must retain the existing numeric SQL instance identity.
    const gameInstances = await this.mysqlAdapter.query('SELECT id FROM game_instances WHERE document_id = ?', [
      deployment.game_instance.documentId,
    ]);
    if (gameInstances.length !== 1) {
      throw new Error(`Expected one game instance row for document ${deployment.game_instance.documentId}`);
    }
    const gameDeployment = gameDeploymentFactory(uuid, rows[0].gd_id, gameInstances[0].id, deployment);
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(gameDeployment, null, 2));
    return gameDeployment;
  }

  public async failedDeployment(): Promise<void> {
    // in case of an error, we want to commit the consumer_uuid to check for error logs later on
    await this.dirtyMysqlAdapter.commit();
  }

  public async finishDeployment(): Promise<void> {
    // this will just rollback the consumer_uuid which is only used for reserving the work
    await this.dirtyMysqlAdapter.rollback();
  }

  public async runningDeployment(gameDeployId: number, cloudInstanceCost: number, tfOutput: TerraformGSOutput): Promise<void> {
    await this.mysqlAdapter.query(
      `
      UPDATE game_deployments
        SET public_ip = ?, private_ip = ?, domain = ?, cost_per_hour = ?, status = 'RUNNING'
      WHERE id = ?;
      `,
      [tfOutput.publicIP, tfOutput.privateIP, tfOutput.dns, cloudInstanceCost, gameDeployId]
    );
  }

  public async stoppedDeployment(gameDeployId: number): Promise<void> {
    await this.mysqlAdapter.query(
      `
      UPDATE game_deployments
        SET stop_time = ?, status = 'STOPPED'
      WHERE id = ?;
      `,
      [new Date(), gameDeployId]
    );
  }

  public async updateStatus(gameDeployId: number, status: string): Promise<void> {
    await this.mysqlAdapter.query(
      `
      UPDATE game_deployments
        SET status = ?
      WHERE id = ?;
      `,
      [status, gameDeployId]
    );
  }
}
