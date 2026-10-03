import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import './login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlockAlt } from '@fortawesome/free-solid-svg-icons';
import colors from '../general/colors/Colors.module.css';
import { StorageAdapter } from '../../StorageAdapter';

const API_URL = import.meta.env.REACT_APP_API_URL ?? 'http://localhost:1337';

export const Login = (): React.JSX.Element => {
  if (StorageAdapter.getInstance().getAuthToken() !== null) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={`login ${colors.surface}`}>
      <FontAwesomeIcon icon={faUnlockAlt} size="2x" className={colors.primaryColor} />
      <h2>Login</h2>
      <a href={`${API_URL}/api/connect/auth0`}>Login</a>
    </div>
  );
};

export const Callback = (): React.JSX.Element => {
  const navigate = useNavigate();
  fetch(`${API_URL}/api/auth/auth0/callback${location.search}`)
    .then((res) => res.json())
    .then((res) => {
      StorageAdapter.getInstance().setAuthToken(res.jwt);
      navigate('/');
    });
  return <div className={`login ${colors.surface}`}>waiting...</div>;
};
