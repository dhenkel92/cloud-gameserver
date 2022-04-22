import React from 'react';
import './GameConfigButtons.css';
import { gql, useMutation } from '@apollo/client';
import { SuccessButton, ErrorButton } from '../../../general/button/Button';
import { GAME_CONFIG_DETAILS } from '../GameConfigDetailQuery';
import { SpinningLoader } from '../../../general/SpinningLoader/SpinningLoader';

const CREATE_GAME_DEPLOY = gql`
  mutation ($gameInstanceId: ID!, $cloudInstanceId: ID!, $time: DateTime!) {
    createGameDeployment(data: { game_instance: $gameInstanceId, cloud_instance: $cloudInstanceId, start_time: $time, status: STARTING }) {
      data {
        id
      }
    }
  }
`;

const STOPE_GAME_DEPLOY = gql`
  mutation ($id: ID!) {
    updateGameDeployment(id: $id, data: { status: STOPPING }) {
      data {
        attributes {
          status
        }
      }
    }
  }
`;

type GameConfigButtonsProps = {
  cloudInstanceId: number;
  gameConfigId: number;
  gameConfigStatus: string;
  gameDeploymentId: string;
};

export const GameConfigButtons = (props: GameConfigButtonsProps): JSX.Element => {
  const [mutation] = useMutation(CREATE_GAME_DEPLOY, {
    refetchQueries: [{ query: GAME_CONFIG_DETAILS, variables: { id: props.gameConfigId } }],
  });

  const [stopMutation] = useMutation(STOPE_GAME_DEPLOY, {
    refetchQueries: [{ query: GAME_CONFIG_DETAILS, variables: { id: props.gameConfigId } }],
  });

  let button = <div></div>;
  switch (props.gameConfigStatus) {
    case 'RUNNING':
      button = <ErrorButton name="Stop" onClick={() => stopMutation({ variables: { id: props.gameDeploymentId } })} />;
      break;
    case 'STOPPED':
      button = (
        <SuccessButton
          name="Start"
          onClick={() => mutation({ variables: { gameInstanceId: props.gameConfigId, cloudInstanceId: 1, time: new Date() } })}
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
