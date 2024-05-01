import { exec } from 'child_process';

export interface ShellResult {
  stdout: string;
  stderr: string;
}

export class ShellAdapter {
  public async exec(command: string): Promise<ShellResult> {
    return new Promise<ShellResult>((resolve, reject) => {
      exec(command, (err, stdout, stderr) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({
          stdout,
          stderr,
        });
      });
    });
  }
}
