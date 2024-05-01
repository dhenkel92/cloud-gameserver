import * as config from 'config';
import { GameDeployment } from './GameDeployment';

export interface MinecraftTFConfig {
  metadata: {
    name: string;
    location: string;
  };
  server: {
    type: string;
    image: string;
    docker_image: string;
  };
  datadog: {
    enabled: boolean;
    api_key: string;
  };
}

export function mcTFConfToTFArgs(mfConfig: MinecraftTFConfig): string {
  return `-var='metadata=${JSON.stringify(mfConfig.metadata)}' -var='server=${JSON.stringify(
    mfConfig.server
  )}' -var='datadog=${JSON.stringify(mfConfig.datadog)}'`;
}

export function createMinecraftTFConfigFromGameConfig(mfConfig: GameDeployment): MinecraftTFConfig {
  return {
    metadata: {
      name: mfConfig.workspaceName,
      location: mfConfig.cloudInstance.region,
    },
    server: {
      type: mfConfig.cloudInstance.apiName,
      image: config.get('hcloudServer.image'),
      docker_image: mfConfig.dockerImage,
    },
    datadog: {
      enabled: config.get('datadog.enabled'),
      api_key: config.get('datadog.api_key'),
    },
  };
}
