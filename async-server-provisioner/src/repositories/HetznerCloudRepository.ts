import { HetznerCloudAdapter } from '../adapters/HetznerCloudAdapter';
import { HetznerServer } from '../entities/HetznerServer';
import { Logger } from 'pino';
import { wait } from '../helper';

export class HetznerCloudRepository {
  constructor(
    private adapter: HetznerCloudAdapter,
    private logger: Logger,
  ) {
  }

  public async getServerByName(name: string): Promise<HetznerServer | null> {
    const servers = await this.adapter.listServer();
    const server = servers.find(s => s.name === name);
    return (server) ? server : null;
  }

  public async shutdownServer(server: HetznerServer): Promise<void> {
    await this.adapter.shutdownServer(server.id);
    let currentServer = server;

    while (currentServer.status !== 'off') {
      // wait for 100ms before polling the hetzner API again
      await wait(500);
      this.logger.info(`Wait for '%s' hetzner server to shutdown`, server.name);
      currentServer = await this.adapter.getServerById(currentServer.id);
    }
  }
}
