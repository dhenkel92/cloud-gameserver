export interface HetznerServer {
  id: number;
  name: string;
  status: string;
  labels: { [key: string]: string };
}

export function createHetznerServer(server: { [key: string]: any }): HetznerServer {
  return {
    id: server.id,
    labels: server.labels,
    name: server.name,
    status: server.status,
  };
}
