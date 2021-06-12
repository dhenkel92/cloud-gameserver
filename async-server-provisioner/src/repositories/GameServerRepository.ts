import MySqlAdapter from '../adapters/MySqlAdapter';
import { GameServer } from '../entities/GameServer';

export class GameServerRepository {
  constructor(private mysql: MySqlAdapter) {}

  async createGameServer(gameConfigId: number, gameServer: GameServer): Promise<void> {
    await this.mysql.query(
      `
          INSERT INTO game_servers (game_config, dns, public_ip, private_ip)
          VALUES (?, ?, ?, ?)
      `,
      [gameConfigId, gameServer.dns, gameServer.publicIP, gameServer.privateIP]
    );
  }

  async deleteGameServerForConfig(gameConfigId: number) {
    await this.mysql.query(
      `
          DELETE
          FROM game_servers
          WHERE game_config = ?
      `,
      [gameConfigId]
    );
  }
}
