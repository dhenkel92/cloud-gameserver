import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
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
  const { search } = useLocation();
  const exchange = useRef<{ search: string; promise: Promise<string> } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (exchange.current?.search !== search) {
      setError(null);
      StorageAdapter.getInstance().clearAuthToken();
      // Share the exchange across Strict Mode's effect replay; never consume the credential twice.
      const promise = (async (): Promise<string> => {
        const response = await fetch(`${API_URL}/api/auth/auth0/callback${search}`, { credentials: 'include' });
        const result: { jwt?: unknown; error?: { message?: string } } | null = await response.json();
        if (!response.ok) {
          throw new Error(result?.error?.message ?? `Authentication failed (HTTP ${response.status})`);
        }
        if (typeof result?.jwt !== 'string' || !result.jwt.trim()) {
          throw new Error('Authentication response did not include a valid token');
        }
        return result.jwt;
      })();
      exchange.current = { search, promise };
    }
    exchange.current.promise
      .then((token) => {
        if (active) {
          StorageAdapter.getInstance().setAuthToken(token);
          navigate('/', { replace: true });
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : 'Authentication failed');
        }
      });
    return () => {
      active = false;
    };
  }, [navigate, search]);

  return (
    <div className={`login ${colors.surface}`}>
      {error ? (
        <>
          <p role="alert">{error}</p>
          <Link to="/login">Sign in again</Link>
        </>
      ) : (
        'waiting...'
      )}
    </div>
  );
};
