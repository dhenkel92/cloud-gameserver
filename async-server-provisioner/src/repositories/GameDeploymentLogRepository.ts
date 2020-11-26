import MySqlAdapter from '../adapters/MySqlAdapter';

export enum GameDeploymentLogSeverity {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARNING = 'WARNING',
  DANGER = 'DANGER',
}

export class GameDeploymentLogRepository {
  constructor(private mysqlAdapter: MySqlAdapter) {
  }

  public async info(gameDeployId: number, message: any): Promise<void> {
    await this.writeLog(gameDeployId, GameDeploymentLogSeverity.INFO, message);
  }

  public async warning(gameDeployId: number, message: any): Promise<void> {
    await this.writeLog(gameDeployId, GameDeploymentLogSeverity.WARNING, message);
  }

  public async danger(gameDeployId: number, message: any): Promise<void> {
    await this.writeLog(gameDeployId, GameDeploymentLogSeverity.DANGER, message);
  }

  public async writeLog(gameDeployId: number, severity: GameDeploymentLogSeverity, message: any): Promise<void> {
    const msg = JSON.stringify(message);
    await this.mysqlAdapter.query(`
      INSERT INTO game_deployment_logs (game_deployment, log_message, severity)
      VALUES (?, ?, ?)
    `, [gameDeployId, msg, severity]);
  }
}
