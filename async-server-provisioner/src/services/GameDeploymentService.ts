import GameDeploymentRepository from '../repositories/GameDeploymentRepository';
import { TerraformService } from './TerraformService';
import { GameDeploymentLogRepository } from '../repositories/GameDeploymentLogRepository';
import { GameDeploymentAction } from '../entities/GameDeployment';

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
      await this.execute();
      await new Promise((resolve) => {
        setTimeout(() => resolve(null), config?.timeoutMillis ?? this.defaults.timeoutMillis);
      });
    }
  }

  private async execute(): Promise<void> {
    const res = await this.gameDeployRepo.getDeployment();
    // tslint:disable-next-line:no-console
    console.dir(res);

    if (res === null) {
      return;
    }

    // tslint:disable-next-line:no-console
    console.dir(res);

    await this.terraformService.init();
    await this.terraformService.changeWorkspace(res.workspaceName);

    // tslint:disable-next-line:switch-default
    switch (res.action) {
      case GameDeploymentAction.START:
        await this.terraformService.apply();
        break;
      case GameDeploymentAction.STOP:
        await this.terraformService.destroy();
        break;
    }

    await this.gameDeployLogRepo.writeLog(res.id, 'isso');
    await this.gameDeployRepo.finishDeployment();
  }
}
