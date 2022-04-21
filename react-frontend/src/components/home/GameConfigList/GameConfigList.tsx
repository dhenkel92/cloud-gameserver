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
          status
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
        status: string;
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

  let entries: JSX.Element[] = [];
  if (data) {
    entries = entries.concat(
      data.gameInstances.data.map((e) => (
        <GameConfigEntry
          gameConfigName={e.attributes.name}
          key={e.id}
          gameConfigId={e.id}
          gameName={e.attributes.game_version.data.attributes.game.data.attributes.name}
          gameConfigStatus={e.attributes.status}
        />
      ))
    );
  }

  return (
    <div className={`configList ${colors.surface}`}>
      {entries}
      <GameConfigEntryEmpty />
    </div>
  );
};
