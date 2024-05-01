import MySqlAdapter from '../adapters/MySqlAdapter';
import { GameDeployment, gameDeploymentFactory } from '../entities/GameDeployment';
import { v4 } from 'uuid';
import { TerraformGSOutput } from '../services/TerraformService';

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
      SELECT gd.id as gd_id, gd.status as gd_status, gd.consumer_uuid as gd_consumer_uuid, ci.provider as ci_provider, ci.api_name as ci_api_name, ci.cost_per_hour as ci_cost_per_hour, ci.region as ci_region, gi.id as gi_id, gi.name as gi_name, gv.docker_image as gv_docker_image
      FROM game_deployments gd
        INNER JOIN game_deployments_game_instance_links gil ON gil.game_deployment_id = gd.id
        INNER JOIN game_instances gi ON gil.game_instance_id = gi.id
        INNER JOIN game_instances_game_version_links gvl ON gvl.game_instance_id = gi.id
        INNER JOIN game_versions gv ON gv.id = gvl.game_version_id
        INNER JOIN game_deployments_cloud_instance_links cil ON cil.game_deployment_id = gd.id
        INNER JOIN cloud_instances ci ON ci.id = cil.cloud_instance_id
      WHERE consumer_uuid = ?;
    `,
      [uuid]
    );

    if (rows.length === 0) {
      return null;
    }

    return gameDeploymentFactory(rows[0]);
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
