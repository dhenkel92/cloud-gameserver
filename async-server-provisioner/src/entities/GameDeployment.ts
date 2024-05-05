import { CloudInstance, cloudInstanceFactory } from './CloudInstance';
import { GameInstance, gameInstanceFactory } from './GameInstance';
import * as config from 'config';

const env = config.get<string>('env');

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
  const rawString = `${env}-${deploy.gameInstance.id}-${deploy.gameInstance.name}`;
  return rawString
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
    .slice(0, 50);
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
