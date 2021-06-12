import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './GameConfigDetails.css';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import colors from '../../general/colors/Colors.module.css';
import { DetailsTable } from './DetailsTable/DetailsTable';
import { DetailsConsole } from './DetailsConsole/DetailsConsole';
import { GAME_CONFIG_DETAILS } from './GameConfigDetailQuery';
import { GameServerDetails } from './GameServerDetails/GameServerDetails';

type GameConfigDetailsResponse = {
  gameConfig: {
    id: number;
    name: string;
    status: string;
    game: {
      name: string;
    };
    game_deployments: {
      action: string;
    }[];
    game_servers: {
      dns: string;
      public_ip: string;
      private_ip: string;
    }[];
  };
};

type GameConfigDetailsProps = {
  name: string;
} & RouteComponentProps<{ id?: string | undefined }>;

export const GameConfigDetails = (props: GameConfigDetailsProps): JSX.Element => {
  const gameConfigId = props.match.params.id;
  const { loading, error, data } = useQuery<GameConfigDetailsResponse>(GAME_CONFIG_DETAILS, {
    variables: { id: gameConfigId },
    pollInterval: 1000,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (!data) return <p>Error :(</p>;
  // eslint-disable-next-line no-console
  console.log(data);

  let gameServerDetails = <p></p>;
  if (data.gameConfig.game_servers.length > 0) {
    const gameServer = data.gameConfig.game_servers[0];
    gameServerDetails = (
      <div className={`gameServerDetails ${colors.surface01}`}>
        <GameServerDetails dns={gameServer.dns} publicIp={gameServer.public_ip} privateIp={gameServer.private_ip} />
      </div>
    );
  }

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
            <DetailsTable
              gameName={data.gameConfig.game.name}
              gameConfigName={data.gameConfig.name}
              gameConfigId={data.gameConfig.id}
              gameConfigStatus={data.gameConfig.status}
            />
          </div>
          {gameServerDetails}
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
