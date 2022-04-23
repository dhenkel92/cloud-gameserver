import * as config from 'config';
import { GameDeployment } from './GameDeployment';

export interface MinecraftTFConfig {
  name: string;
  location: string;
  dockerImage: string;
  server: {
    type: string;
    image: string;
  };
  configuration: string;
}

export function mcTFConfToTFArgs(mfConfig: MinecraftTFConfig): string {
  return `-var='name=${mfConfig.name}' -var='location=${mfConfig.location}' -var='s3_base_path=${
    mfConfig.dockerImage
  }' -var='server=${JSON.stringify(mfConfig.server)}' -var='game_config=${mfConfig.configuration}'`;
}

export function createMinecraftTFConfigFromGameConfig(mfConfig: GameDeployment): MinecraftTFConfig {
  return {
    name: mfConfig.workspaceName,
    dockerImage: mfConfig.gameInstance.dockerImage,
    location: mfConfig.cloudInstance.region,
    server: {
      type: mfConfig.cloudInstance.apiName,
      image: config.get('hcloudServer.image'),
    },
    configuration: '{}',
  };
}
