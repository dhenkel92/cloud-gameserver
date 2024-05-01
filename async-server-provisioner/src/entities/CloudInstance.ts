export interface CloudInstance {
  provider: string;
  apiName: string;
  costPerHour: number;
  region: string;
}

export function cloudInstanceFactory(row: any): CloudInstance {
  return {
    provider: row.data.attributes.provider,
    apiName: row.data.attributes.api_name,
    costPerHour: row.data.attributes.cost_per_hour,
    region: row.data.attributes.region,
  };
}
