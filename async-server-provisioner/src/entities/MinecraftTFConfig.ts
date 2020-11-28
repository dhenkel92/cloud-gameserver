import { GameDeployment } from './GameDeployment';

export interface MinecraftTFConfig {
  name: string;
  location: string;
  s3BasePath: string;
  server: {
    type: string;
    image: string;
  }
}

export function mcTFConfToTFArgs(config: MinecraftTFConfig): string {
  return `-var='name=${config.name}' -var='location=${config.location}' -var='s3_base_path=${config.s3BasePath}' -var='server=${JSON.stringify(config.server)}'`;
}

export function createMinecraftTFConfigFromGameConfig(config: GameDeployment): MinecraftTFConfig {
  return {
    name: config.workspaceName,
    s3BasePath: `${config.gameConfig.s3BasePath}/${config.workspaceName}`,
    location: 'nbg1',
    server: {
      type: 'cx31',
      image: '26563390',
    },
  };
}
