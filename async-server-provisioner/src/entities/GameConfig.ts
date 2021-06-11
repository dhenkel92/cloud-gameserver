export enum GameConfigStatus {
  STARTING = 'STARTING',
  RUNNING = 'RUNNING',
  STOPPING = 'STOPPING',
  STOPPED = 'STOPPED',
  FAILED = 'FAILED',
}

export interface GameConfig {
  id: number;
  name: string;
  s3BasePath: string;
  configuration: string;
  status: GameConfigStatus;
}

function statusToGCStatus(status: string): GameConfigStatus {
  switch (status) {
    case 'STARTING':
      return GameConfigStatus.STARTING;
    case 'RUNNING':
      return GameConfigStatus.RUNNING;
    case 'STOPPING':
      return GameConfigStatus.STOPPING;
    case 'STOPPED':
      return GameConfigStatus.STOPPED;
    case 'FAILED':
      return GameConfigStatus.FAILED;
  }
}

export function gameConfigFactory(row: any): GameConfig {
  return {
    id: row.gc_id,
    name: row.gc_name,
    s3BasePath: row.g_s3_base_path,
    configuration: row.gc_configuration,
    status: statusToGCStatus(row.gc_status as string),
  };
}
