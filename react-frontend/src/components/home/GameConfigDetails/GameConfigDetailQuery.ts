import { gql } from '@apollo/client';

export const GAME_CONFIG_DETAILS = gql`
  query gameInstance($id: ID!) {
    gameInstances(filters: { id: { eq: $id } }) {
      data {
        id
        attributes {
          name
          status
          game_deployments(sort: ["start_time:desc"]) {
            data {
              id
              attributes {
                status
                public_ip
                private_ip
                start_time
                stop_time
                domain
                cost_per_hour
                cloud_instance {
                  data {
                    attributes {
                      name
                      cpu
                      memory
                    }
                  }
                }
              }
            }
          }
          game_version {
            data {
              attributes {
                version
                game_flavour {
                  data {
                    attributes {
                      name
                    }
                  }
                }
                game {
                  data {
                    attributes {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export type GameConfigDetailsResponse = {
  gameInstances: {
    data: {
      id: number;
      attributes: {
        name: string;
        status: string;
        game_deployments: {
          data: {
            id: string;
            attributes: {
              status: string;
              public_ip: string;
              private_ip: string;
              start_time: string;
              stop_time: string;
              domain: string;
              cost_per_hour: number;
              cloud_instance: {
                data: {
                  attributes: {
                    name: string;
                    cpu: string;
                    memory: string;
                  };
                };
              };
            };
          }[];
        };
        game_version: {
          data: {
            attributes: {
              version: string;
              game_flavour: {
                data: {
                  attributes: {
                    name: string;
                  };
                };
              };
              game: {
                data: {
                  attributes: {
                    name: string;
                  };
                };
              };
            };
          };
        };
      };
    }[];
  };
};
