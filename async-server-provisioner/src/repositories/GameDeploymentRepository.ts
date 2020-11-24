import MySqlAdapter from '../adapters/MySqlAdapter';
import { GameDeployment, gameDeploymentFactory } from '../entities/GameDeployment';
import { v4 } from 'uuid';

export default class GameDeploymentRepository {
  constructor(private mysqlAdapter: MySqlAdapter) {
  }

  public async getDeployment(): Promise<GameDeployment | null> {
    const uuid = v4();

    await this.mysqlAdapter.query(`
      UPDATE game_deployments
      SET consumer_id = ?, status = "RUNNING", updated_at = now()
      WHERE status = 'WAITING' and consumer_id is null
      LIMIT 1
    `, [uuid]);
    const rows = await this.mysqlAdapter.query(`
      SELECT gd.id, gd.consumer_id, gc.name, gc.startup_script, gc.server_config, gc.s3_base_path
      FROM game_deployments gd
        INNER JOIN game_configs gc ON gc.id = gd.game_config
      WHERE gd.status = 'RUNNING' and consumer_id = ?
    `, [uuid]);

    if (rows.length === 0) {
      return null;
    }

    return gameDeploymentFactory(rows[0]);
  }

  public async finishDeployment(deployId: number): Promise<void> {
    await this.mysqlAdapter.query(`
    UPDATE game_deployments
    SET status = 'FINISHED'
    WHERE id = ?
    `, [deployId]);
  }
}
