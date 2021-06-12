import './GameConfigEntry.css';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import colors from '../../../general/colors/Colors.module.css';
import { PrimaryLinkButton } from '../../../general/button/LinkButton';
import { gameConfigStatusToColor } from '../../../../helpers/gameConfigStatusToColor';

type GameConfigEntryProps = {
  gameConfigId: string;
  gameConfigName: string;
  gameName: string;
  gameConfigStatus: string;
};

export class GameConfigEntry extends React.Component<GameConfigEntryProps> {
  render(): JSX.Element {
    return (
      <div className={`configEntryWrapper ${colors.surface02} ${colors.primaryHover}`}>
        <div className="configEntryHeader">{this.props.gameName}</div>
        <div className="configEntryImage">
          <Link to={`/config/${this.props.gameConfigId}`}>
            <img
              alt={this.props.gameName}
              src={'https://i.computer-bild.de/imgs/1/1/5/2/9/5/0/5/Minecraft-1024x576-8b2043ae37807fa0.jpg'}
            />
          </Link>
        </div>
        <div className="configName">{this.props.gameConfigName}</div>
        <div className="configEntryStatus">
          <FontAwesomeIcon icon={faCircle} color={gameConfigStatusToColor(this.props.gameConfigStatus)} /> {this.props.gameConfigStatus}
        </div>
        <div className="configEntryButton">
          <PrimaryLinkButton name="Configure" to={`/config/${this.props.gameConfigId}`} />
          {/*<Link to="/config/12" className={`${btnStyle.myButton} ${colors.primary}`}>*/}
          {/*  Configure*/}
          {/*</PrimaLink>*/}
        </div>
      </div>
    );
  }
}
