export interface GameInstance {
  id: number;
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

export interface GameInstanceDocument {
  documentId: string;
  name: string;
  game_version: {
    docker_image: string;
    ports: GameInstancePort[];
    backup_paths: GameInstanceBackupPath[];
  };
}

export function gameInstanceFactory(id: number, row: GameInstanceDocument): GameInstance {
  const gameVersion = row.game_version;
  return {
    id,
    name: row.name,
    dockerImage: gameVersion.docker_image,
    ports: gameVersion.ports.map(parseGameInstancePort),
    backupPaths: gameVersion.backup_paths.map(parseGameInstanceBackupPaths),
  };
}

function parseGameInstancePort(raw: GameInstancePort): GameInstancePort {
  return {
    name: raw.name,
    port: raw.port,
    type: raw.type,
  };
}

function parseGameInstanceBackupPaths(raw: GameInstanceBackupPath): GameInstanceBackupPath {
  return {
    name: raw.name,
    path: raw.path,
  };
}
