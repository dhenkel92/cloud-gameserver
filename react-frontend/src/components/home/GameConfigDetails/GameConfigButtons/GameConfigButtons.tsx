import React from 'react';
import './GameConfigButtons.css';
import { gql, useMutation } from '@apollo/client';
import { ErrorButton, SuccessButton } from '../../../general/button/Button';
import { GAME_CONFIG_DETAILS } from '../GameConfigDetailQuery';

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
  gameConfigId: number;
};

export const GameConfigButtons = (props: GameConfigButtonsProps): JSX.Element => {
  const [mutation] = useMutation(CREATE_GAME_DEPLOY, {
    refetchQueries: [{ query: GAME_CONFIG_DETAILS, variables: { id: props.gameConfigId } }],
  });

  return (
    <div className="gameButtonGroup">
      <SuccessButton name="Start" onClick={() => mutation({ variables: { id: props.gameConfigId, action: 'START' } })} />
      <ErrorButton name="Stop" onClick={() => mutation({ variables: { id: props.gameConfigId, action: 'STOP' } })} />
    </div>
  );
};
