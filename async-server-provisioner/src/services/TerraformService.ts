import { Logger } from 'pino';
import { ShellAdapter, ShellResult } from '../adapters/ShellAdapter';
import { GameDeployment, GameDeploymentStatus } from '../entities/GameDeployment';
import { GameDeploymentLogRepository } from '../repositories/GameDeploymentLogRepository';
import { createMinecraftTFConfigFromGameConfig, mcTFConfToTFArgs, MinecraftTFConfig } from '../entities/MinecraftTFConfig';

export interface TerraformGSOutput {
  privateIP: string;
  publicIP: string;
  dns: string;
}

export class TerraformService {
  constructor(
    private terraformPath: string,
    private shellAdapter: ShellAdapter,
    private gameDeployLogRepo: GameDeploymentLogRepository,
    private logger: Logger
  ) {}

  public async execute(config: GameDeployment): Promise<TerraformGSOutput | null> {
    const tfVars = createMinecraftTFConfigFromGameConfig(config);
    await this.init(config.id);
    await this.changeWorkspace(config.id, config.workspaceName);

    switch (config.status) {
      case GameDeploymentStatus.STARTING:
        await this.apply(config.id, tfVars);
        const output = await this.getOutput();
        return {
          dns: '',
          privateIP: output.server_private_ip.value,
          publicIP: output.server_public_ip.value,
        };
      case GameDeploymentStatus.STOPPING:
        await this.destroy(config.id, tfVars);
        return null;
      default:
        throw new Error(`Invalid deployment action: ${config.status}`);
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

  private async getOutput(): Promise<{ [key: string]: any }> {
    this.logger.info('get terraform output as json');
    const command = `cd ${this.terraformPath} && terragrunt output --json`;
    this.logger.info(command);
    const res = await this.shellAdapter.exec(command);
    return JSON.parse(res.stdout);
  }

  private async writeShellLog(_gameDeployId: number, _shellRes: ShellResult): Promise<void> {
    // todo: do nothing?
  }
}
