export interface GameServer {
  privateIP: string;
  publicIP: string;
  dns: string;
}

export function gameServerFactory(row: any): GameServer {
  return {
    publicIP: row.public_ip,
    privateIP: row.private_ip,
    dns: row.dns,
  };
}
