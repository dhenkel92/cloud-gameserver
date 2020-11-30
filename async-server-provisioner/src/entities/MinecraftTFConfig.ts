import * as config from 'config';
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

export function mcTFConfToTFArgs(mfConfig: MinecraftTFConfig): string {
  return `-var='name=${mfConfig.name}' -var='location=${mfConfig.location}' -var='s3_base_path=${mfConfig.s3BasePath}' -var='server=${JSON.stringify(mfConfig.server)}'`;
}

export function createMinecraftTFConfigFromGameConfig(mfConfig: GameDeployment): MinecraftTFConfig {
  return {
    name: mfConfig.workspaceName,
    s3BasePath: `${mfConfig.gameConfig.s3BasePath}/${mfConfig.workspaceName}`,
    location: config.get('hcloudServer.location'),
    server: {
      type: config.get('hcloudServer.type'),
      image: config.get('hcloudServer.image'),
    },
  };
}
