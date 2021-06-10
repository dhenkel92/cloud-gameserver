import MySqlAdapter from '../adapters/MySqlAdapter';
import { GameConfigStatus } from '../entities/GameConfig';

export class GameConfigRepository {
  constructor(private adapter: MySqlAdapter) {}

  async updateGCStatus(gameConfigId: number, status: GameConfigStatus): Promise<void> {
    await this.adapter.query(
      `
          UPDATE game_configs
          SET status = ?
          WHERE id = ?
      `,
      [status.toString(), gameConfigId]
    );
  }
}
