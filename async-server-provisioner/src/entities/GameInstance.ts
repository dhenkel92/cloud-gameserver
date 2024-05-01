export interface GameInstance {
  name: string;
  dockerImage: string;
}

export function gameInstanceFactory(row: any): GameInstance {
  const gameVersion = row.data.attributes.game_version;
  return {
    name: row.data.attributes.name,
    dockerImage: gameVersion.data.attributes.docker_image,
  };
}
