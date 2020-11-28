export interface GameConfig {
  name: string;
  s3BasePath: string;
  startupScript: string;
  serverConfig: string;
}

export function gameConfigFactory(row: any): GameConfig {
  return {
    name: row.gc_name,
    s3BasePath: row.g_s3_base_path,
    serverConfig: row.gc_server_config,
    startupScript: row.gc_startup_script,
  };
}
