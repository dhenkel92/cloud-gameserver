import { GameConfig, gameConfigFactory } from './GameConfig';

export enum GameDeploymentAction {
  START = 'START',
  STOP = 'STOP',
}

export interface GameDeployment {
  id: number;
  uuid: string;
  action: GameDeploymentAction;
  workspaceName: string;
  gameConfig: GameConfig;
  s3Path: string;
}

function generateTFWorkspaceName(row: any): string {
  const rawString = `${row.gc_id}-${row.gc_name}`;
  return rawString.replace(/([\s-_])/g, '-').toLowerCase();
}

export function gameDeploymentFactory(row: any): GameDeployment {
  const gameConfig = gameConfigFactory(row);
  const workspaceName = generateTFWorkspaceName(row);
  return {
    gameConfig,
    workspaceName,
    id: row.gd_id,
    uuid: row.gd_uuid,
    action: (GameDeploymentAction as any)[row.gd_action],
    s3Path: `${gameConfig.s3BasePath}/${workspaceName}`,
  };
}
