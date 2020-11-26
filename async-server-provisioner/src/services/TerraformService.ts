import { ShellAdapter, ShellResult } from '../adapters/ShellAdapter';
import { GameDeployment, GameDeploymentAction } from '../entities/GameDeployment';
import { GameDeploymentLogRepository } from '../repositories/GameDeploymentLogRepository';

export class TerraformService {
  constructor(
    private shellAdapter: ShellAdapter,
    private gameDeployLogRepo: GameDeploymentLogRepository,
  ) {
  }

  public async execute(config: GameDeployment): Promise<void> {
    await this.init(config.id);
    await this.changeWorkspace(config.id, config.workspaceName);

    switch (config.action) {
      case GameDeploymentAction.START:
        await this.apply(config.id);
        break;
      case GameDeploymentAction.STOP:
        await this.destroy(config.id);
        break;
      default:
        throw new Error(`Invalid deployment action: ${config.action}`);
    }
  }

  public async init(gameDeployId: number): Promise<void> {
    const res = await this.shellAdapter.exec('cd ./terraform && terraform init');
    await this.writeShellLog(gameDeployId, res);
  }

  private async changeWorkspace(gameDeployId: number, name: string): Promise<void> {
    try {
      const newWorkspaceRes = await this.shellAdapter.exec(`cd ./terraform && terraform workspace new ${name}`);
      await this.writeShellLog(gameDeployId, newWorkspaceRes);
    } catch (e) {
      // ignore
    }
    const res = await this.shellAdapter.exec(`cd ./terraform && terraform workspace select ${name}`);
    await this.writeShellLog(gameDeployId, res);
  }

  private async apply(gameDeployId: number): Promise<void> {
    const res = await this.shellAdapter.exec('cd ./terraform && terraform apply -auto-approve');
    await this.writeShellLog(gameDeployId, res);
  }

  private async destroy(gameDeployId: number): Promise<void> {
    const res = await this.shellAdapter.exec('cd ./terraform && terraform destroy -auto-approve');
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
