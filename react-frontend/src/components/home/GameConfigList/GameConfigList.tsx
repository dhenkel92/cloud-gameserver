import React from 'react';
import './GameConfigList.css';
import { GameConfigEntry } from './GameConfigEntry/GameConfigEntry';
import colors from '../../general/colors/Colors.module.css';
import { GameConfigEntryEmpty } from './GameConfigEntryEmpty/GameConfigEntryEmpty';
import { gql, useQuery } from '@apollo/client';

const GAME_CONFIGS = gql`
  query {
    gameConfigs {
      name
    }
  }
`;

interface GameConfigResponse {
  gameConfigs: {
    name: string;
  }[];
}

export const GameConfigList = (): JSX.Element => {
  const { loading, error, data } = useQuery<GameConfigResponse>(GAME_CONFIGS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data);
  let entries: JSX.Element[] = [];
  if (data) {
    entries = entries.concat(data.gameConfigs.map((e) => <GameConfigEntry name={e.name} key={e.name} />));
  }

  return (
    <div className={`configList ${colors.surface}`}>
      {entries}
      <GameConfigEntryEmpty />
    </div>
  );
};
