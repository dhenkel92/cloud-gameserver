import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './GameConfigDetails.css';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import colors from '../../general/colors/Colors.module.css';
import { DetailsTable } from './DetailsTable/DetailsTable';
import { DetailsConsole } from './DetailsConsole/DetailsConsole';
import { GAME_CONFIG_DETAILS, GameConfigDetailsResponse } from './GameConfigDetailQuery';
import { GameServerDetails } from './GameServerDetails/GameServerDetails';

export const GameConfigDetails = (): React.JSX.Element => {
  const { id: gameConfigId } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery<GameConfigDetailsResponse>(GAME_CONFIG_DETAILS, {
    variables: { documentId: gameConfigId },
    pollInterval: 1000,
    notifyOnNetworkStatusChange: false,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (!data?.gameInstance) return <p>Error :(</p>;
  const gameInstance = data.gameInstance;

  let deploymentStatus = 'STOPPED';
  let gameDeploymentId: string | undefined;
  let gameServerDetails = <p></p>;
  if (gameInstance.game_deployments.length > 0) {
    // Deployments are sorted newest first.
    const gameServer = gameInstance.game_deployments[0];
    deploymentStatus = gameServer.status;
    gameDeploymentId = gameServer.documentId;

    if (gameServer.status == 'RUNNING') {
      gameServerDetails = (
        <div className={`gameServerDetails ${colors.surface01}`}>
          <GameServerDetails
            dns={gameServer.domain}
            publicIp={gameServer.public_ip}
            privateIp={gameServer.private_ip}
            ports={gameServer.game_server_ports ?? []}
          />
        </div>
      );
    }
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
            <img alt={gameInstance.name} src={'https://i.computer-bild.de/imgs/1/1/5/2/9/5/0/5/Minecraft-1024x576-8b2043ae37807fa0.jpg'} />
            <DetailsTable
              gameName={gameInstance.game_version?.game?.name ?? '-'}
              gameConfigName={gameInstance.name}
              gameConfigId={gameInstance.documentId}
              cloudInstanceId={data.cloudInstances[0]?.documentId}
              gameConfigStatus={deploymentStatus}
              gameDeploymentId={gameDeploymentId}
            />
          </div>
          {gameServerDetails}
        </div>
        <div className={`configDetailsLog`}>
          <div className={`test2 ${colors.surface01}`}>
            <DetailsConsole deployments={gameInstance.game_deployments} />
          </div>
        </div>
      </div>
    </div>
  );
};
