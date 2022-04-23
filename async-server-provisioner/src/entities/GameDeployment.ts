import { CloudInstance, cloudInstanceFactory } from './CloudInstance';
import { GameInstance, gameInstanceFactory } from './GameInstance';

export enum GameDeploymentStatus {
  STARTING = 'STARTING',
  STOPPING = 'STOPPING',
}

export interface GameDeployment {
  id: number;
  workspaceName: string;
  consumerUUID: string;
  status: GameDeploymentStatus;
  cloudInstance: CloudInstance;
  gameInstance: GameInstance;
}

function generateTFWorkspaceName(row: any): string {
  const rawString = `${row.gc_id}-${row.gc_name}`;
  return rawString.replace(/([\s-_])/g, '-').toLowerCase();
}

export function gameDeploymentFactory(row: any): GameDeployment {
  const workspaceName = generateTFWorkspaceName(row);
  return {
    workspaceName,
    id: row.gd_id,
    consumerUUID: row.gd_consumer_uuid,
    status: (GameDeploymentStatus as any)[row.gd_status],
    cloudInstance: cloudInstanceFactory(row),
    gameInstance: gameInstanceFactory(row),
  };
}
