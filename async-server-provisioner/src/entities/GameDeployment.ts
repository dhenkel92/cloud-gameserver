import { CloudInstance, CloudInstanceDocument, cloudInstanceFactory } from './CloudInstance';
import { GameInstance, GameInstanceDocument, gameInstanceFactory } from './GameInstance';
import config from 'config';

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

export interface GameDeploymentDocument {
  documentId: string;
  status: GameDeploymentStatus;
  cloud_instance: CloudInstanceDocument;
  game_instance: GameInstanceDocument;
}

export function generateTFWorkspaceName(deploy: GameDeployment): string {
  const rawString = `${env}-${deploy.gameInstance.id}-${deploy.gameInstance.name}`;
  return rawString
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
    .slice(0, 50);
}

export function gameDeploymentFactory(
  consumerUid: string,
  deploymentId: number,
  gameInstanceId: number,
  row: GameDeploymentDocument
): GameDeployment {
  return {
    id: deploymentId,
    consumerUUID: consumerUid,
    status: row.status,
    cloudInstance: cloudInstanceFactory(row.cloud_instance),
    gameInstance: gameInstanceFactory(gameInstanceId, row.game_instance),
  };
}
