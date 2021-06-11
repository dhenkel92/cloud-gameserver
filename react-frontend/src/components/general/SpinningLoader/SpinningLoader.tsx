import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import './SpinningLoader.css';

export const SpinningLoader = (): JSX.Element => {
  return (
    <div className="spinningLoader">
      <FontAwesomeIcon icon={faSpinner} size="2x" />
    </div>
  );
};
