import MySqlAdapter from '../adapters/MySqlAdapter';

export class GameDeploymentLogRepository {
  constructor(private mysqlAdapter: MySqlAdapter) {
  }

  public async writeLog(gameDeployId: number, message: string): Promise<void> {
    await this.mysqlAdapter.query(`
    INSERT INTO game_deployment_logs (game_deployment, log)
    VALUES (?, ?)
    `, [gameDeployId, message]);
  }
}
