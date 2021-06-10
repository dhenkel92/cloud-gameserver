import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './GameConfigDetails.css';
import { Link, Redirect, RouteComponentProps } from 'react-router-dom';
import colors from '../../general/colors/Colors.module.css';
import { DetailsTable } from './DetailsTable/DetailsTable';
import { DetailsConsole } from './DetailsConsole/DetailsConsole';
import { gql, useQuery } from '@apollo/client';

const GAME_CONFIG_DETAILS = gql`
  query gameConfig($id: ID!) {
    gameConfig(id: $id) {
      name
      game {
        name
      }
    }
  }
`;

type GameConfigDetailsResponse = {
  gameConfig: {
    name: string;
    game: {
      name: string;
    };
  };
};

type GameConfigDetailsProps = {
  name: string;
} & RouteComponentProps<{ id?: string | undefined }>;

export const GameConfigDetails = (props: GameConfigDetailsProps): JSX.Element => {
  const gameConfigId = props.match.params.id;
  const { loading, error, data } = useQuery<GameConfigDetailsResponse>(GAME_CONFIG_DETAILS, { variables: { id: gameConfigId } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (!data) return <p>Error :(</p>;

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
            <img
              alt={data.gameConfig.game.name}
              src={'https://i.computer-bild.de/imgs/1/1/5/2/9/5/0/5/Minecraft-1024x576-8b2043ae37807fa0.jpg'}
            />
            <DetailsTable gameName={data.gameConfig.game.name} gameConfigName={data.gameConfig.name} />
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
};
