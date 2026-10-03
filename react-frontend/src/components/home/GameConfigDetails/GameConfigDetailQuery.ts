import { gql } from '@apollo/client';

export const GAME_CONFIG_DETAILS = gql`
  query GameConfigDetails($documentId: ID!) {
    gameInstance(documentId: $documentId) {
      documentId
      name
      game_deployments(sort: ["start_time:desc"]) {
        documentId
        status
        public_ip
        private_ip
        start_time
        stop_time
        domain
        cost_per_hour
        game_server_ports {
          port
          protocol
          is_open
        }
        cloud_instance {
          documentId
          name
          cpu
          memory
        }
      }
      game_version {
        version
        game_flavour {
          name
        }
        game {
          name
        }
      }
    }
    cloudInstances(sort: ["createdAt:asc"], pagination: { limit: 1 }) {
      documentId
    }
  }
`;

export type GameServerPort = {
  port: number;
  protocol: string;
  is_open: boolean;
};

export type GameDeployment = {
  documentId: string;
  status: string;
  public_ip: string | null;
  private_ip: string | null;
  start_time: string;
  stop_time: string | null;
  domain: string | null;
  cost_per_hour: number | null;
  game_server_ports: GameServerPort[] | null;
  cloud_instance: {
    documentId: string;
    name: string;
    cpu: string;
    memory: string;
  } | null;
};

export type GameConfigDetailsResponse = {
  gameInstance: {
    documentId: string;
    name: string;
    game_deployments: GameDeployment[];
    game_version: {
      version: string;
      game_flavour: { name: string } | null;
      game: { name: string } | null;
    } | null;
  } | null;
  cloudInstances: { documentId: string }[];
};
