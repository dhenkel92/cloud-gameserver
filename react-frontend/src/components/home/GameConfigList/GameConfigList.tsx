import React from 'react';
import './GameConfigList.css';
import { gql, useQuery } from '@apollo/client';
import colors from '../../general/colors/Colors.module.css';
import { GameConfigEntry } from './GameConfigEntry/GameConfigEntry';
import { GameConfigEntryEmpty } from './GameConfigEntryEmpty/GameConfigEntryEmpty';

const GAME_CONFIGS = gql`
  query {
    gameInstances {
      data {
        id
        attributes {
          name
          game_deployments(sort: ["start_time:desc"], pagination: { limit: 1 }) {
            data {
              attributes {
                status
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

interface GameConfigResponse {
  gameInstances: {
    data: {
      id: string;
      attributes: {
        name: string;
        game_deployments: {
          data: {
            attributes: {
              status: string;
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
}

export const GameConfigList = (): JSX.Element => {
  const { loading, error, data } = useQuery<GameConfigResponse>(GAME_CONFIGS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const entries: JSX.Element[] = [];
  if (data) {
    for (const gameInstance of data.gameInstances.data) {
      let status = 'STOPPED';
      if (gameInstance.attributes.game_deployments.data.length > 0) {
        status = gameInstance.attributes.game_deployments.data[0].attributes.status;
      }
      entries.push(
        <GameConfigEntry
          gameConfigName={gameInstance.attributes.name}
          key={gameInstance.id}
          gameConfigId={gameInstance.id}
          gameName={gameInstance.attributes.game_version.data.attributes.game.data.attributes.name}
          gameConfigStatus={status}
        />
      );
    }
  }

  return (
    <div className={`configList ${colors.surface}`}>
      {entries}
      <GameConfigEntryEmpty />
    </div>
  );
};
