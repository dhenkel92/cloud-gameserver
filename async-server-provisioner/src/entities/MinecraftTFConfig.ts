import { GameConfig } from './GameConfig';

export interface MinecraftTFConfig {
  name: string;
  location: string;
  server: {
    type: string;
    image: string;
  }
}

export function createMinecraftTFConfigFromGameConfig(config: GameConfig): MinecraftTFConfig {
  return {
    name: config.name,
    location: 'nbg1',
    server: {
      type: 'cx31',
      image: '26563390',
    },
  };
}
