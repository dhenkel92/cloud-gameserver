import nodeFetch from 'node-fetch';
import { createHetznerServer, HetznerServer } from '../entities/HetznerServer';

export class HetznerCloudAdapter {
  private static readonly API_BASE_PATH = 'https://api.hetzner.cloud/v1';

  constructor(private token: string) {
  }

  private defaultHeader(): { [key: string]: string } {
    return {
      Authorization: `Bearer ${this.token}`,
    };
  }

  public async listServer(): Promise<HetznerServer[]> {
    const result = await nodeFetch(`${HetznerCloudAdapter.API_BASE_PATH}/servers`, {
      headers: this.defaultHeader(),
    });
    const json = await result.json();
    return json.servers.map(createHetznerServer);
  }

  public async getServerById(id: number): Promise<HetznerServer> {
    const result = await nodeFetch(`${HetznerCloudAdapter.API_BASE_PATH}/servers/${id}`, {
      headers: this.defaultHeader(),
    });
    const json = await result.json();
    return createHetznerServer(json.server);
  }

  public async shutdownServer(serverId: number) {
    await nodeFetch(`${HetznerCloudAdapter.API_BASE_PATH}/servers/${serverId}/actions/shutdown`, {
      method: 'POST',
      headers: this.defaultHeader(),
    });
  }
}
