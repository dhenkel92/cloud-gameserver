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
}

function generateTFWorkspaceName(row: any): string {
  const rawString = `${row.gc_id}${row.gc_name}`;
  return rawString.replace(/([\s-_])/g, '_');
}

export function gameDeploymentFactory(row: any): GameDeployment {
  return {
    id: row.gd_id,
    uuid: row.gd_uuid,
    action: (GameDeploymentAction as any)[row.gd_action],
    workspaceName: generateTFWorkspaceName(row),
    gameConfig: gameConfigFactory(row),
  };
}
