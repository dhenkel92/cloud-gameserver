import MySqlAdapter from '../adapters/MySqlAdapter';
import { GameDeployment, gameDeploymentFactory } from '../entities/GameDeployment';
import { v4 } from 'uuid';
import { TerraformGSOutput } from '../services/TerraformService';
import { gqlQuery } from '../adapters/GraphQlAdapter';

const query = `
query($id: ID) {
  gameDeployment(id: $id) {
    data {
      id
      attributes {
        status
        cloud_instance {
          data {
            attributes {
              api_name
              provider
              region
              cost_per_hour
            }
          }
        }
        game_instance {
          data {
            attributes {
              name
              game_version {
                data {
                  attributes {
                    docker_image
                    ports {
                      name
                      port
                      type
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

export default class GameDeploymentRepository {
  constructor(
    private mysqlAdapter: MySqlAdapter,
    private dirtyMysqlAdapter: MySqlAdapter
  ) {}

  public async getDeployment(): Promise<GameDeployment | null> {
    const uuid = v4();

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
      SELECT gd.id as gd_id
      FROM game_deployments gd
      WHERE consumer_uuid = ?;
    `,
      [uuid]
    );

    if (rows.length === 0) {
      return null;
    }

    const data = await gqlQuery(query, { id: rows[0].gd_id });
    const gameDeployment = gameDeploymentFactory(uuid, data);
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
