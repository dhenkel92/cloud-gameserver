import React from 'react';
import './GameConfigButtons.css';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { SuccessButton, ErrorButton } from '../../../general/button/Button';
import { GAME_CONFIG_DETAILS } from '../GameConfigDetailQuery';
import { SpinningLoader } from '../../../general/SpinningLoader/SpinningLoader';

export const CREATE_GAME_DEPLOY = gql`
  mutation StartGameDeployment($gameInstanceId: ID!, $cloudInstanceId: ID!, $time: DateTime!) {
    createGameDeployment(data: { game_instance: $gameInstanceId, cloud_instance: $cloudInstanceId, start_time: $time, status: STARTING }) {
      documentId
      status
    }
  }
`;

export const STOP_GAME_DEPLOY = gql`
  mutation StopGameDeployment($documentId: ID!) {
    updateGameDeployment(documentId: $documentId, data: { status: STOPPING }) {
      documentId
      status
    }
  }
`;

type GameConfigButtonsProps = {
  cloudInstanceId?: string;
  gameConfigId: string;
  gameConfigStatus: string;
  gameDeploymentId?: string;
};

export const GameConfigButtons = (props: GameConfigButtonsProps): React.JSX.Element => {
  const [mutation] = useMutation(CREATE_GAME_DEPLOY, {
    refetchQueries: [{ query: GAME_CONFIG_DETAILS, variables: { documentId: props.gameConfigId } }],
  });

  const [stopMutation] = useMutation(STOP_GAME_DEPLOY, {
    refetchQueries: [{ query: GAME_CONFIG_DETAILS, variables: { documentId: props.gameConfigId } }],
  });

  let button = <div></div>;
  switch (props.gameConfigStatus) {
    case 'RUNNING':
      button = (
        <ErrorButton
          name="Stop"
          disabled={!props.gameDeploymentId}
          onClick={() => stopMutation({ variables: { documentId: props.gameDeploymentId } })}
        />
      );
      break;
    case 'STOPPED':
      button = (
        <SuccessButton
          name="Start"
          disabled={!props.cloudInstanceId}
          onClick={() =>
            mutation({
              variables: { gameInstanceId: props.gameConfigId, cloudInstanceId: props.cloudInstanceId, time: new Date().toISOString() },
            })
          }
        />
      );
      break;
    case 'STARTING':
    case 'STOPPING':
      button = <SpinningLoader />;
      break;
  }

  return <div className="gameButtonGroup">{button}</div>;
};
