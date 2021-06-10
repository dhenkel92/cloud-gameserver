import './GameConfigEntryEmpty.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import colors from '../../../general/colors/Colors.module.css';

export class GameConfigEntryEmpty extends React.Component {
  render(): JSX.Element {
    return (
      <div className={`configEntryWrapper ${colors.surface02} ${colors.primaryHover}`}>
        <Link to="/">
          <div className="createNewGameConfig">
            <FontAwesomeIcon icon={faPlus} size="3x" className={colors.primaryColor} />
          </div>
        </Link>
      </div>
    );
  }
}
