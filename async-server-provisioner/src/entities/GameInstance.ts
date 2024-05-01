export interface GameInstance {
  name: string;
  dockerImage: string;
  ports: GameInstancePort[];
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

export function gameInstanceFactory(row: any): GameInstance {
  const gameVersion = row.data.attributes.game_version;
  return {
    name: row.data.attributes.name,
    dockerImage: gameVersion.data.attributes.docker_image,
    ports: gameVersion.data.attributes.ports.map(parseGameInstancePort),
  };
}

function parseGameInstancePort(raw: any): GameInstancePort {
  return {
    name: raw.name,
    port: raw.port,
    type: (GameInstancePortType as any)[raw.type],
  };
}
