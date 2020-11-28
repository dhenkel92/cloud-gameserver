import { Logger } from 'pino';
import GameDeploymentRepository from '../repositories/GameDeploymentRepository';
import { TerraformService } from './TerraformService';
import { GameDeploymentLogRepository } from '../repositories/GameDeploymentLogRepository';

export interface GameDeploymentServiceConfig {
  timeoutMillis?: number;
}

export class GameDeploymentService {
  private readonly defaults: GameDeploymentServiceConfig = {
    timeoutMillis: 5 * 1000,
  };
  private isRunning: boolean = false;

  constructor(
    private terraformService: TerraformService,
    private gameDeployRepo: GameDeploymentRepository,
    private gameDeployLogRepo: GameDeploymentLogRepository,
    private logger: Logger,
  ) {
  }

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

  private async execute(): Promise<void> {
    const res = await this.gameDeployRepo.getDeployment();

    if (res === null) {
      return;
    }

    this.logger.info('received new message %s', JSON.stringify(res));
    try {
      await this.terraformService.execute(res);
      await this.gameDeployRepo.finishDeployment();
    } catch (e) {
      this.logger.error('failed to execute message');
      this.logger.error(e);
      await Promise.all([
        this.gameDeployLogRepo.danger(res.id, e),
        this.gameDeployRepo.finishDeployment(),
      ]);
    }
  }
}
