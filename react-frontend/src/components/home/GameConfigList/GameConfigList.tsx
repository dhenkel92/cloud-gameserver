import React from 'react';
import './GameConfigList.css';
import { GameConfigEntry } from './GameConfigEntry/GameConfigEntry';
import colors from '../../general/colors/Colors.module.css';
import { GameConfigEntryEmpty } from './GameConfigEntryEmpty/GameConfigEntryEmpty';
import { gql, useQuery } from '@apollo/client';

const GAME_CONFIGS = gql`
  query {
    gameConfigs {
      id
      name
      game {
        name
      }
    }
  }
`;

interface GameConfigResponse {
  gameConfigs: {
    id: string;
    name: string;
    game: {
      name: string;
    };
  }[];
}

export const GameConfigList = (): JSX.Element => {
  const { loading, error, data } = useQuery<GameConfigResponse>(GAME_CONFIGS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  let entries: JSX.Element[] = [];
  if (data) {
    entries = entries.concat(
      data.gameConfigs.map((e) => <GameConfigEntry gameConfigName={e.name} key={e.id} gameConfigId={e.id} gameName={e.game.name} />)
    );
  }

  return (
    <div className={`configList ${colors.surface}`}>
      {entries}
      <GameConfigEntryEmpty />
    </div>
  );
};
