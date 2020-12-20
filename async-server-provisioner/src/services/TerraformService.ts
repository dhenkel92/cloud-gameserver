import { Logger } from 'pino';
import { ShellAdapter, ShellResult } from '../adapters/ShellAdapter';
import { GameDeployment, GameDeploymentAction } from '../entities/GameDeployment';
import { GameDeploymentLogRepository } from '../repositories/GameDeploymentLogRepository';
import { createMinecraftTFConfigFromGameConfig, mcTFConfToTFArgs, MinecraftTFConfig } from '../entities/MinecraftTFConfig';

export class TerraformService {
  constructor(
    private terraformPath: string,
    private shellAdapter: ShellAdapter,
    private gameDeployLogRepo: GameDeploymentLogRepository,
    private logger: Logger
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
    this.logger.info('initialize terraform');
    const res = await this.shellAdapter.exec(`cd ${this.terraformPath} && terragrunt init`);
    await this.writeShellLog(gameDeployId, res);
  }

  private async changeWorkspace(gameDeployId: number, name: string): Promise<void> {
    this.logger.info('create new workspace');
    try {
      const newWorkspaceRes = await this.shellAdapter.exec(`cd ${this.terraformPath} && terragrunt workspace new ${name}`);
      await this.writeShellLog(gameDeployId, newWorkspaceRes);
    } catch (e) {
      this.logger.info('workspace already exists');
    }
    const res = await this.shellAdapter.exec(`cd ${this.terraformPath} && terragrunt workspace select ${name}`);
    await this.writeShellLog(gameDeployId, res);
  }

  private async apply(gameDeployId: number, tfConfig: MinecraftTFConfig): Promise<void> {
    this.logger.info('apply terraform');
    const tfArgs = mcTFConfToTFArgs(tfConfig);
    const command = `cd ${this.terraformPath} && terragrunt apply -auto-approve ${tfArgs}`;
    this.logger.info(command);
    const res = await this.shellAdapter.exec(command);
    await this.writeShellLog(gameDeployId, res);
  }

  private async destroy(gameDeployId: number, tfConfig: MinecraftTFConfig): Promise<void> {
    this.logger.info('destroy terraform');
    const tfArgs = mcTFConfToTFArgs(tfConfig);
    const command = `cd ${this.terraformPath} && terragrunt destroy -auto-approve ${tfArgs}`;
    this.logger.info(command);
    const res = await this.shellAdapter.exec(command);
    await this.writeShellLog(gameDeployId, res);
  }

  private async writeShellLog(gameDeployId: number, shellRes: ShellResult): Promise<void> {
    const promises = [];
    if (shellRes.stdout !== '') {
      this.logger.info(shellRes.stdout);
      promises.push(this.gameDeployLogRepo.info(gameDeployId, shellRes.stdout));
    }
    if (shellRes.stderr !== '') {
      this.logger.warn(shellRes.stderr);
      promises.push(this.gameDeployLogRepo.info(gameDeployId, shellRes.stderr));
    }
    await Promise.all(promises);
  }
}
