import * as config from 'config';
import { GameDeployment, generateTFWorkspaceName } from './GameDeployment';

export interface MinecraftTFConfig {
  metadata: {
    name: string;
    location: string;
    game_instance: {
      id: number;
    };
  };
  server: {
    type: string;
    image: string;
    docker_image: string;
    ports: {
      proto: string;
      port: string;
      description: string;
    }[];
    backup_s3_bucket: string;
    backup_paths: {
      path: string;
    }[];
  };
  datadog: {
    enabled: boolean;
    api_key: string;
  };
}

export function mcTFConfToTFArgs(mfConfig: MinecraftTFConfig): string {
  return `-var='metadata=${JSON.stringify(mfConfig.metadata)}' -var='server=${JSON.stringify(
    mfConfig.server
  )}' -var='datadog=${JSON.stringify(mfConfig.datadog)}' -var='ansible_branch=${config.get('cloudGame.ansibleBranch')}'`;
}

export function createMinecraftTFConfigFromGameConfig(mfConfig: GameDeployment): MinecraftTFConfig {
  return {
    metadata: {
      name: generateTFWorkspaceName(mfConfig),
      location: mfConfig.cloudInstance.region,
      game_instance: {
        id: mfConfig.gameInstance.id,
      },
    },
    server: {
      type: mfConfig.cloudInstance.apiName,
      image: config.get('hcloudServer.image'),
      docker_image: mfConfig.gameInstance.dockerImage,
      ports: mfConfig.gameInstance.ports.map((port) => ({
        proto: port.type.toLowerCase(),
        port: `${port.port}`,
        description: port.name,
      })),
      backup_s3_bucket: config.get('cloudGame.backupS3Bucket'),
      backup_paths: mfConfig.gameInstance.backupPaths.map((p) => ({
        path: p.path,
      })),
    },
    datadog: {
      enabled: config.get('datadog.enabled'),
      api_key: config.get('datadog.api_key'),
    },
  };
}
