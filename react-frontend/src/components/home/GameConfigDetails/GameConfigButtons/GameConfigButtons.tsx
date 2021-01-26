import React from 'react';
import './GameConfigButtons.css';
import { ErrorButton, SuccessButton } from '../../../general/button/Button';

export class GameConfigButtons extends React.Component {
  render(): JSX.Element {
    return (
      <div className="gameButtonGroup">
        <SuccessButton name="Start" />
        <ErrorButton name="Stop" />
      </div>
    );
  }
}
