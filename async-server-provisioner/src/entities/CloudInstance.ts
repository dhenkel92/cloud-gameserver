export interface CloudInstance {
  provider: string;
  apiName: string;
  costPerHour: number;
  region: string;
}

export function cloudInstanceFactory(row: any): CloudInstance {
  return {
    provider: row.ci_provider,
    apiName: row.ci_api_name,
    costPerHour: row.ci_cost_per_hour,
    region: row.ci_region,
  };
}
