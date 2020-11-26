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
        await new Promise((resolve) => {
          setTimeout(() => resolve(null), config?.timeoutMillis ?? this.defaults.timeoutMillis);
        });
      } catch (e) {
        // tslint:disable-next-line:no-console
        console.error('Error while processing message', e);
      }
    }
  }

  private async execute(): Promise<void> {
    const res = await this.gameDeployRepo.getDeployment();

    if (res === null) {
      return;
    }

    try {
      await this.terraformService.execute(res);
      await this.gameDeployRepo.finishDeployment();
    } catch (e) {
      await this.gameDeployLogRepo.danger(res.id, e);
    }
  }
}
