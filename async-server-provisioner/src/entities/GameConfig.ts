export enum GameConfigStatus {
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED',
  FAILED = 'FAILED',
  ACTION_SCHEDULED = 'ACTION_SCHEDULED',
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
    case 'RUNNING':
      return GameConfigStatus.RUNNING;
    case 'STOPPED':
      return GameConfigStatus.STOPPED;
    case 'FAILED':
      return GameConfigStatus.FAILED;
    case 'ACTION_SCHEDULED':
      return GameConfigStatus.ACTION_SCHEDULED;
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
