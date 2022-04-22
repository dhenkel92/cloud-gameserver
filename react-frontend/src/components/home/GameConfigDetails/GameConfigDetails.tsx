import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './GameConfigDetails.css';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import colors from '../../general/colors/Colors.module.css';
import { DetailsTable } from './DetailsTable/DetailsTable';
import { DetailsConsole } from './DetailsConsole/DetailsConsole';
import { GAME_CONFIG_DETAILS, GameConfigDetailsResponse } from './GameConfigDetailQuery';
import { GameServerDetails } from './GameServerDetails/GameServerDetails';

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
  if (!data || data.gameInstances.data.length == 0) return <p>Error :(</p>;
  const gameInstance = data.gameInstances.data[0];
  // eslint-disable-next-line no-console
  console.log(gameInstance);

  let deploymentStatus = 'STOPPED';
  let gameServerDetails = <p></p>;
  if (gameInstance.attributes.game_deployments.data.length > 0) {
    // always take the first entry as it's in a decending order
    const gameServer = gameInstance.attributes.game_deployments.data[0];
    deploymentStatus = gameServer.attributes.status;
    gameServerDetails = (
      <div className={`gameServerDetails ${colors.surface01}`}>
        <GameServerDetails
          dns={gameServer.attributes.domain}
          publicIp={gameServer.attributes.public_ip}
          privateIp={gameServer.attributes.private_ip}
          // todo: fix
          ports={[]}
        />
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
              alt={gameInstance.attributes.name}
              src={'https://i.computer-bild.de/imgs/1/1/5/2/9/5/0/5/Minecraft-1024x576-8b2043ae37807fa0.jpg'}
            />
            <DetailsTable
              gameName={gameInstance.attributes.game_version.data.attributes.game.data.attributes.name}
              gameConfigName={gameInstance.attributes.name}
              gameConfigId={gameInstance.id}
              gameConfigStatus={deploymentStatus}
            />
          </div>
          {gameServerDetails}
        </div>
        <div className={`configDetailsLog`}>
          <div className={`test2 ${colors.surface01}`}>
            <DetailsConsole deployments={gameInstance.attributes.game_deployments.data} />
          </div>
        </div>
      </div>
    </div>
  );
};
