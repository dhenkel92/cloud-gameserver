import { Logger } from 'pino';
import GameDeploymentRepository from '../repositories/GameDeploymentRepository';
import { TerraformService } from './TerraformService';
import { GameDeploymentLogRepository } from '../repositories/GameDeploymentLogRepository';
import { HetznerCloudRepository } from '../repositories/HetznerCloudRepository';
import { GameDeploymentAction } from '../entities/GameDeployment';

export interface GameDeploymentServiceConfig {
  timeoutMillis?: number;
}

export class GameDeploymentService {
  private readonly defaults: GameDeploymentServiceConfig = {
    timeoutMillis: 5 * 1000,
  };
  private isRunning = false;

  constructor(
    private terraformService: TerraformService,
    private gameDeployRepo: GameDeploymentRepository,
    private gameDeployLogRepo: GameDeploymentLogRepository,
    private hcloudRepo: HetznerCloudRepository,
    private logger: Logger
  ) {}

  public stop() {
    this.isRunning = false;
  }

  public async start(config?: GameDeploymentServiceConfig) {
    this.isRunning = true;

    while (this.isRunning) {
      try {
        await this.execute();
      } catch (e) {
        this.logger.error('Error while processing message %s', e);
      }
      await new Promise((resolve) => {
        setTimeout(() => resolve(null), config?.timeoutMillis ?? this.defaults.timeoutMillis);
      });
    }
  }

  private async shutdownHetznerServer(name: string) {
    this.logger.info('manually shutdown hetzner server');
    const server = await this.hcloudRepo.getServerByName(name);
    if (server !== null) {
      await this.hcloudRepo.shutdownServer(server);
    } else {
      this.logger.warn('Server with name %s not found', name);
    }
    this.logger.info('hetzner server successfully shutdown');
  }

  private async execute(): Promise<void> {
    const res = await this.gameDeployRepo.getDeployment();

    if (res === null) {
      return;
    }

    this.logger.info('received new message %s', JSON.stringify(res));
    try {
      if (res.action === GameDeploymentAction.STOP) {
        await this.shutdownHetznerServer(res.workspaceName);
      }

      this.logger.info('start terraform execution');
      await this.terraformService.execute(res);
      this.logger.info('finished terraform execution');
      await this.gameDeployRepo.finishDeployment();
    } catch (e) {
      this.logger.error('failed to execute message');
      this.logger.error(e);
      await Promise.all([this.gameDeployLogRepo.danger(res.id, e), this.gameDeployRepo.finishDeployment()]);
    }
  }
}
