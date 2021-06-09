import React, { useState } from 'react';
import './login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlockAlt } from '@fortawesome/free-solid-svg-icons';
import colors from '../general/colors/Colors.module.css';
import { Input } from '../general/input/Input';
import { PrimaryButton } from '../general/button/Button';
import { Redirect } from 'react-router-dom';
import { StorageAdapter } from '../../StorageAdapter';
import { gql, useMutation } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(input: { identifier: $username, password: $password }) {
      jwt
    }
  }
`;

interface LoginResponse {
  login: {
    jwt: string;
  };
}

export const Login = (): JSX.Element => {
  const [login, setLogin] = useState({ username: '', password: '' });
  const [sendLogin, { data }] = useMutation<LoginResponse>(LOGIN_MUTATION);

  if (data) {
    StorageAdapter.getInstance().setAuthToken(data.login.jwt);
  }

  if (StorageAdapter.getInstance().getAuthToken() !== null) {
    return <Redirect to="/" />;
  }

  return (
    <div className={`login ${colors.surface}`}>
      <FontAwesomeIcon icon={faUnlockAlt} size="2x" className={colors.primaryColor} />
      <h2>Login</h2>
      <div className="form">
        <Input
          placeholder="Username"
          value={login.username}
          onChange={(e) => setLogin({ username: e.target.value, password: login.password })}
        />
        <Input
          placeholder="Password"
          type="password"
          value={login.password}
          onChange={(e) => setLogin({ username: login.username, password: e.target.value })}
        />
        <PrimaryButton
          name="Login"
          className="loginButton"
          onClick={(e) => {
            e.preventDefault();
            sendLogin({ variables: { username: login.username, password: login.password } });
          }}
        />
      </div>
    </div>
  );
};
