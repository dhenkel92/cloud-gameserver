import { ShellAdapter } from '../adapters/ShellAdapter';

export class TerraformService {
  constructor(private shellAdapter: ShellAdapter) {
  }

  public async init(): Promise<void> {
    const res = await this.shellAdapter.exec('cd ./terraform && terraform init');
    // tslint:disable-next-line:no-console
    console.dir(res);
  }

  public async changeWorkspace(name: string): Promise<void> {
    const isso = await this.shellAdapter.exec(`cd ./terraform && terraform workspace new ${name}`);
    // tslint:disable-next-line:no-console
    console.dir(isso);
    const res = await this.shellAdapter.exec(`cd ./terraform && terraform workspace select ${name}`);
    // tslint:disable-next-line:no-console
    console.dir(res);
  }

  public async apply(): Promise<void> {
    const res = await this.shellAdapter.exec('cd ./terraform && terraform apply -auto-approve');
    // tslint:disable-next-line:no-console
    console.dir(res);
  }
}
