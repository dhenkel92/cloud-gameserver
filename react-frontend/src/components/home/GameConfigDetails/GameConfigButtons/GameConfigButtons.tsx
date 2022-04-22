import React from 'react';
import './GameConfigButtons.css';
import { gql, useMutation } from '@apollo/client';
import { SuccessButton, ErrorButton } from '../../../general/button/Button';
import { GAME_CONFIG_DETAILS } from '../GameConfigDetailQuery';
import { SpinningLoader } from '../../../general/SpinningLoader/SpinningLoader';

const CREATE_GAME_DEPLOY = gql`
  mutation ($id: ID!, $action: ENUM_GAMEDEPLOYMENT_ACTION!) {
    createGameDeployment(input: { data: { game_config: $id, status: WAITING, action: $action } }) {
      gameDeployment {
        id
      }
    }
  }
`;

type GameConfigButtonsProps = {
  cloudInstanceId: number;
  gameConfigId: number;
  gameConfigStatus: string;
};

export const GameConfigButtons = (props: GameConfigButtonsProps): JSX.Element => {
  const [mutation] = useMutation(CREATE_GAME_DEPLOY, {
    refetchQueries: [{ query: GAME_CONFIG_DETAILS, variables: { id: props.gameConfigId } }],
  });

  let button = <div></div>;
  switch (props.gameConfigStatus) {
    case 'RUNNING':
      button = (
        <ErrorButton disabled={true} name="Stop" onClick={() => mutation({ variables: { id: props.gameConfigId, action: 'STOP' } })} />
      );
      break;
    case 'STOPPED':
      button = <SuccessButton name="Start" onClick={() => mutation({ variables: { id: props.gameConfigId, action: 'START' } })} />;
      break;
    case 'STARTING':
    case 'STOPPING':
      button = <SpinningLoader />;
      break;
  }

  return <div className="gameButtonGroup">{button}</div>;
};
