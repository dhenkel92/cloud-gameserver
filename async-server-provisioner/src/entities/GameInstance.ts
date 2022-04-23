export interface GameInstance {
  name: string;
  dockerImage: string;
}

export function gameInstanceFactory(row: any): GameInstance {
  return {
    name: row.gi_name,
    dockerImage: row.gv_docker_image,
  };
}
