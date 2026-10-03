import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing/react';
import { GAME_CONFIGS } from '../home/GameConfigList/GameConfigList';
import { StorageAdapter } from '../../StorageAdapter';
import { App } from './App';

test.each(['/', '/config/instance-document', '/login'])('shows login for an unauthenticated visit to %s', (path) => {
  StorageAdapter.getInstance().clearAuthToken();
  window.history.replaceState({}, '', path);

  render(<App />);

  expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute(
    'href',
    `${import.meta.env.REACT_APP_API_URL ?? 'http://localhost:1337'}/api/connect/auth0`
  );
  expect(window.location.pathname).toBe('/login');
});

test('logout removes credentials and leaves the protected dashboard', async () => {
  const storage = StorageAdapter.getInstance();
  storage.setAuthToken('test-token');
  window.history.replaceState({}, '', '/');

  render(
    <MockedProvider mocks={[{ request: { query: GAME_CONFIGS }, result: { data: { gameInstances: [] } } }]}>
      <App />
    </MockedProvider>
  );

  fireEvent.click(await screen.findByText('Logout'));

  expect(storage.getAuthToken()).toBeNull();
  expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  expect(window.location.pathname).toBe('/login');
});
