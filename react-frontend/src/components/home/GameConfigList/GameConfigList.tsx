import React from 'react';
import './GameConfigList.css';
import { GameConfigEntry } from './GameConfigEntry/GameConfigEntry';
import colors from '../../general/colors/Colors.module.css';
import { GameConfigEntryEmpty } from './GameConfigEntryEmpty/GameConfigEntryEmpty';

export class GameConfigList extends React.Component {
  render(): JSX.Element {
    return (
      <div className={`configList ${colors.surface}`}>
        <GameConfigEntry />
        <GameConfigEntryEmpty />
      </div>
    );
  }
}
