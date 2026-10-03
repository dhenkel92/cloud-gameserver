export interface CloudInstance {
  provider: string;
  apiName: string;
  costPerHour: number;
  region: string;
}

export interface CloudInstanceDocument {
  provider: string;
  api_name: string;
  cost_per_hour: number;
  region: string;
}

export function cloudInstanceFactory(row: CloudInstanceDocument): CloudInstance {
  return {
    provider: row.provider,
    apiName: row.api_name,
    costPerHour: row.cost_per_hour,
    region: row.region,
  };
}
