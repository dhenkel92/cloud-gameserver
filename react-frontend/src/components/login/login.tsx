import React from 'react';
import { useHistory } from 'react-router-dom';
import './login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlockAlt } from '@fortawesome/free-solid-svg-icons';
import { Redirect } from 'react-router-dom';
import colors from '../general/colors/Colors.module.css';
import { StorageAdapter } from '../../StorageAdapter';

const API_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:1337';

export const Login = (): JSX.Element => {
  if (StorageAdapter.getInstance().getAuthToken() !== null) {
    return <Redirect to="/" />;
  }

  return (
    <div className={`login ${colors.surface}`}>
      <FontAwesomeIcon icon={faUnlockAlt} size="2x" className={colors.primaryColor} />
      <h2>Login</h2>
      <a href={`${API_URL}/api/connect/auth0`}>Login</a>
    </div>
  );
};

export const Callback = (): JSX.Element => {
  const history = useHistory();
  fetch(`${API_URL}/api/auth/auth0/callback${location.search}`)
    .then((res) => res.json())
    .then((res) => {
      StorageAdapter.getInstance().setAuthToken(res.jwt);
      history.push('/');
    });
  return <div className={`login ${colors.surface}`}>waiting...</div>;
};
