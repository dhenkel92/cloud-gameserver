import './GameConfigEntry.css';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import btnStyle from '../../../general/button/Button.module.css';
import colors from '../../../general/colors/Colors.module.css';

export class GameConfigEntry extends React.Component {
  render(): JSX.Element {
    return (
      <div className={`configEntryWrapper ${colors.surface02} ${colors.primaryHover}`}>
        <div className="configEntryHeader">Minecraft</div>
        <div className="configEntryImage">
          <Link to="/config/12">
            <img alt="Minecraft" src={'https://i.computer-bild.de/imgs/1/1/5/2/9/5/0/5/Minecraft-1024x576-8b2043ae37807fa0.jpg'} />
          </Link>
        </div>
        <div className="configName">The pack - v1.0.0</div>
        <div className="configEntryStatus">
          <FontAwesomeIcon icon={faCircle} color="red" /> Offline
        </div>
        <div className="configEntryButton">
          <Link to="/config/12" className={`${btnStyle.myButton} ${colors.primary}`}>
            Configure
          </Link>
        </div>
      </div>
    );
  }
}
