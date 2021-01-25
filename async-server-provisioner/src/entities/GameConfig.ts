export interface GameConfig {
  name: string;
  s3BasePath: string;
  configuration: string;
}

export function gameConfigFactory(row: any): GameConfig {
  return {
    name: row.gc_name,
    s3BasePath: row.g_s3_base_path,
    configuration: row.gc_configuration,
  };
}
