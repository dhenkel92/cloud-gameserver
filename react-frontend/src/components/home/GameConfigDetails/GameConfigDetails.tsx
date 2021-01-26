import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './GameConfigDetails.css';
import { Link, RouteComponentProps } from 'react-router-dom';
import colors from '../../general/colors/Colors.module.css';
import { DetailsTable } from './DetailsTable/DetailsTable';
import { DetailsConsole } from './DetailsConsole/DetailsConsole';

interface GameConfigDetailsPropsParams {
  id: string;
}

type GameConfigDetailsProps = {
  name: string;
} & RouteComponentProps<GameConfigDetailsPropsParams>;

export class GameConfigDetails extends React.Component<GameConfigDetailsProps> {
  render(): JSX.Element {
    return (
      <div className="configDetailsWrapper">
        <div className={colors.primaryColor}>
          <Link to="/">
            <FontAwesomeIcon icon={faArrowLeft} size="2x" />
          </Link>
        </div>
        <div className="configDetailsContentWrapper">
          <div className={`configDetails`}>
            <div className={`test1 ${colors.surface01}`}>
              <img alt="Minecraft" src={'https://i.computer-bild.de/imgs/1/1/5/2/9/5/0/5/Minecraft-1024x576-8b2043ae37807fa0.jpg'} />
              <DetailsTable />
            </div>
          </div>
          <div className={`configDetailsLog`}>
            <div className={`test2 ${colors.surface01}`}>
              <DetailsConsole />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
