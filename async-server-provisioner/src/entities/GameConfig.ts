export interface GameConfig {
  name: string;
  s3BasePath: string;
  startupScript: string;
  serverConfig: string;
}

export function gameConfigFactory(row: any): GameConfig {
  return {
    name: row.name,
    s3BasePath: row.s3_base_path,
    serverConfig: row.server_config,
    startupScript: row.startup_script,
  };
}
