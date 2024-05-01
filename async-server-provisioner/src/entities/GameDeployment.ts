import { CloudInstance, cloudInstanceFactory } from './CloudInstance';
import { GameInstance, gameInstanceFactory } from './GameInstance';

export enum GameDeploymentStatus {
  STARTING = 'STARTING',
  STOPPING = 'STOPPING',
}

export interface GameDeployment {
  id: number;
  consumerUUID: string;
  status: GameDeploymentStatus;
  cloudInstance: CloudInstance;
  gameInstance: GameInstance;
}

export function generateTFWorkspaceName(deploy: GameDeployment): string {
  const rawString = `${deploy.id}-${deploy.gameInstance.name}`;
  return rawString.replace(/([\s-_])/g, '-').toLowerCase();
}

export function gameDeploymentFactory(consumerUid: string, row: any): GameDeployment {
  const gameDeployment = row.data.gameDeployment;
  const cloudInstance = gameDeployment.data.attributes.cloud_instance;
  const gameInstance = gameDeployment.data.attributes.game_instance;
  return {
    id: gameDeployment.data.id,
    consumerUUID: consumerUid,
    status: (GameDeploymentStatus as any)[gameDeployment.data.attributes.status],
    cloudInstance: cloudInstanceFactory(cloudInstance),
    gameInstance: gameInstanceFactory(gameInstance),
  };
}
