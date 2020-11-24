import { GameConfig, gameConfigFactory } from './GameConfig';

export interface GameDeployment {
  id: number;
  consumerId: string;
  gameConfig: GameConfig;
}

export function gameDeploymentFactory(row: any): GameDeployment {
  return {
    id: row.id,
    consumerId: row.consumer_id,
    gameConfig: gameConfigFactory(row),
  };
}
