import MySqlAdapter from '../adapters/MySqlAdapter';
import { GameDeployment, gameDeploymentFactory } from '../entities/GameDeployment';
import { v4 } from 'uuid';

export default class GameDeploymentRepository {
  constructor(
    private mysqlAdapter: MySqlAdapter,
    private dirtyMysqlAdapter: MySqlAdapter,
  ) {
  }

  public async getDeployment(): Promise<GameDeployment | null> {
    const uuid = v4();

    await this.dirtyMysqlAdapter.beginTransaction();
    await this.dirtyMysqlAdapter.query(`
      UPDATE game_deployments
      SET status = 'FINISHED', uuid = ?
      WHERE id = (SELECT id FROM (SELECT id FROM game_deployments WHERE status = 'WAITING' LIMIT 1) as temp)
    `, [uuid]);

    const rows = await this.dirtyMysqlAdapter.query(`
      SELECT gd.id as gd_id, gd.uuid as gd_uuid, gd.action as gd_action, gc.id as gc_id, gc.name as gc_name, gc.startup_script as gc_startup_script, gc.server_config as gc_server_config, gc.s3_base_path as gc_s3_base_path
      FROM game_deployments gd
        INNER JOIN game_configs gc ON gc.id = gd.game_config
      WHERE gd.status = 'FINISHED' and uuid = ?
    `, [uuid]);

    if (rows.length === 0) {
      return null;
    }

    return gameDeploymentFactory(rows[0]);
  }

  public async finishDeployment(): Promise<void> {
    await this.dirtyMysqlAdapter.commit();
  }
}
