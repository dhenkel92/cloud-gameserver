import React from 'react';
import './GameConfigList.css';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import colors from '../../general/colors/Colors.module.css';
import { GameConfigEntry } from './GameConfigEntry/GameConfigEntry';
import { GameConfigEntryEmpty } from './GameConfigEntryEmpty/GameConfigEntryEmpty';

export const GAME_CONFIGS = gql`
  query GameConfigs {
    gameInstances {
      documentId
      name
      game_deployments(sort: ["start_time:desc"], pagination: { limit: 1 }) {
        status
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
  }
`;

interface GameConfigResponse {
  gameInstances: {
    documentId: string;
    name: string;
    game_deployments: { status: string }[];
    game_version: {
      version: string;
      game_flavour: { name: string } | null;
      game: { name: string } | null;
    } | null;
  }[];
}

export const GameConfigList = (): React.JSX.Element => {
  const { loading, error, data } = useQuery<GameConfigResponse>(GAME_CONFIGS, {
    notifyOnNetworkStatusChange: false,
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const entries: React.JSX.Element[] = [];
  if (data) {
    for (const gameInstance of data.gameInstances) {
      const status = gameInstance.game_deployments[0]?.status ?? 'STOPPED';
      entries.push(
        <GameConfigEntry
          gameConfigName={gameInstance.name}
          key={gameInstance.documentId}
          gameConfigId={gameInstance.documentId}
          gameName={gameInstance.game_version?.game?.name ?? '-'}
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
