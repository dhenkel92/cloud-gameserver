import { ShellAdapter, ShellResult } from '../adapters/ShellAdapter';
import { GameDeployment, GameDeploymentAction } from '../entities/GameDeployment';
import { GameDeploymentLogRepository } from '../repositories/GameDeploymentLogRepository';
import { createMinecraftTFConfigFromGameConfig, mcTFConfToTFArgs, MinecraftTFConfig } from '../entities/MinecraftTFConfig';

export class TerraformService {
  constructor(
    private shellAdapter: ShellAdapter,
    private gameDeployLogRepo: GameDeploymentLogRepository,
  ) {
  }

  public async execute(config: GameDeployment): Promise<void> {
    const tfVars = createMinecraftTFConfigFromGameConfig(config);
    await this.init(config.id);
    await this.changeWorkspace(config.id, config.workspaceName);

    switch (config.action) {
      case GameDeploymentAction.START:
        await this.apply(config.id, tfVars);
        break;
      case GameDeploymentAction.STOP:
        await this.destroy(config.id, tfVars);
        break;
      default:
        throw new Error(`Invalid deployment action: ${config.action}`);
    }
  }

  private async init(gameDeployId: number): Promise<void> {
    const res = await this.shellAdapter.exec('cd ./terraform/02-game-server && terraform init');
    await this.writeShellLog(gameDeployId, res);
  }

  private async changeWorkspace(gameDeployId: number, name: string): Promise<void> {
    try {
      const newWorkspaceRes = await this.shellAdapter.exec(`cd ./terraform/02-game-server && terragrunt workspace new ${name}`);
      await this.writeShellLog(gameDeployId, newWorkspaceRes);
    } catch (e) {
      // ignore
    }
    const res = await this.shellAdapter.exec(`cd ./terraform/02-game-server && terragrunt workspace select ${name}`);
    await this.writeShellLog(gameDeployId, res);
  }

  private async apply(gameDeployId: number, tfConfig: MinecraftTFConfig): Promise<void> {
    const tfArgs = mcTFConfToTFArgs(tfConfig);
    const command = `cd ./terraform/02-game-server && terragrunt apply -auto-approve ${tfArgs}`;
    // tslint:disable-next-line:no-console
    console.log('apply', command);
    const res = await this.shellAdapter.exec(command);
    await this.writeShellLog(gameDeployId, res);
  }

  private async destroy(gameDeployId: number, tfConfig: MinecraftTFConfig): Promise<void> {
    const tfArgs = mcTFConfToTFArgs(tfConfig);
    const command = `cd ./terraform/02-game-server && terragrunt destroy -auto-approve ${tfArgs}`;
    // tslint:disable-next-line:no-console
    console.log('destroy', command);
    const res = await this.shellAdapter.exec(command);
    await this.writeShellLog(gameDeployId, res);
  }

  private async writeShellLog(gameDeployId: number, shellRes: ShellResult): Promise<void> {
    const promises = [];
    if (shellRes.stdout !== '') {
      promises.push(this.gameDeployLogRepo.info(gameDeployId, shellRes.stdout));
    }
    if (shellRes.stderr !== '') {
      promises.push(this.gameDeployLogRepo.info(gameDeployId, shellRes.stderr));
    }
    await Promise.all(promises);
  }
}
