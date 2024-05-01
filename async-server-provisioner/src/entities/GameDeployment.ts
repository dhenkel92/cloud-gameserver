import { CloudInstance, cloudInstanceFactory } from './CloudInstance';
import { GameInstance, gameInstanceFactory } from './GameInstance';

export enum GameDeploymentStatus {
  STARTING = 'STARTING',
  STOPPING = 'STOPPING',
}

export interface GameDeployment {
  id: number;
  workspaceName: string;
  dockerImage: string;
  consumerUUID: string;
  status: GameDeploymentStatus;
  cloudInstance: CloudInstance;
  gameInstance: GameInstance;
}

function generateTFWorkspaceName(row: any): string {
  const rawString = `${row.gi_id}-${row.gi_name}`;
  return rawString.replace(/([\s-_])/g, '-').toLowerCase();
}

export function gameDeploymentFactory(row: any): GameDeployment {
  const workspaceName = generateTFWorkspaceName(row);
  return {
    workspaceName,
    id: row.gd_id,
    consumerUUID: row.gd_consumer_uuid,
    dockerImage: row.gv_docker_image,
    status: (GameDeploymentStatus as any)[row.gd_status],
    cloudInstance: cloudInstanceFactory(row),
    gameInstance: gameInstanceFactory(row),
  };
}
