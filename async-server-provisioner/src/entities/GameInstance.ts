export interface GameInstance {
  name: string;
  dockerImage: string;
  ports: GameInstancePort[];
  backupPaths: GameInstanceBackupPath[];
}

export enum GameInstancePortType {
  UDP = 'UDP',
  TCP = 'TCP',
}

export interface GameInstancePort {
  name: string;
  port: number;
  type: GameInstancePortType;
}

export interface GameInstanceBackupPath {
  name: string;
  path: string;
}

export function gameInstanceFactory(row: any): GameInstance {
  const gameVersion = row.data.attributes.game_version;
  return {
    name: row.data.attributes.name,
    dockerImage: gameVersion.data.attributes.docker_image,
    ports: gameVersion.data.attributes.ports.map(parseGameInstancePort),
    backupPaths: gameVersion.data.attributes.backup_paths.map(parseGameInstanceBackupPaths),
  };
}

function parseGameInstancePort(raw: any): GameInstancePort {
  return {
    name: raw.name,
    port: raw.port,
    type: (GameInstancePortType as any)[raw.type],
  };
}

function parseGameInstanceBackupPaths(raw: any): GameInstanceBackupPath {
  return {
    name: raw.name,
    path: raw.path,
  };
}
