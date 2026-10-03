import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, vi } from 'vitest';
import { AUTH_TOKEN_NAME, StorageAdapter } from '../../StorageAdapter';
import { Callback, Login } from './login';

beforeEach(() => localStorage.clear());
afterEach(() => vi.unstubAllGlobals());

const renderCallback = (): void => {
  render(
    <React.StrictMode>
      <MemoryRouter initialEntries={['/connect/auth0?access_token=single-use-credential']}>
        <Routes>
          <Route path="/connect/auth0" element={<Callback />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<h1>Authenticated dashboard</h1>} />
        </Routes>
      </MemoryRouter>
    </React.StrictMode>
  );
};

test('Strict Mode exchanges a single-use credential without overwriting the valid token', async () => {
  let credentialConsumed = false;
  const fetchCallback = vi.fn(async (): Promise<Response> => {
    if (credentialConsumed) {
      return new Response(JSON.stringify({ error: { message: 'Credential already consumed' } }), { status: 401 });
    }
    credentialConsumed = true;
    return new Response(JSON.stringify({ jwt: 'header.payload.signature' }), { status: 200 });
  });
  vi.stubGlobal('fetch', fetchCallback);

  renderCallback();

  expect(await screen.findByRole('heading', { name: 'Authenticated dashboard' })).toBeInTheDocument();
  await waitFor(() => expect(StorageAdapter.getInstance().getAuthToken()).toBe('header.payload.signature'));
  expect(fetchCallback).toHaveBeenCalledTimes(1);
});

test('a rejected provider callback stays out of the dashboard and allows signing in again', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify({ error: { message: 'Invalid provider access token' } }), { status: 401 }))
  );
  renderCallback();

  expect(await screen.findByRole('alert')).toHaveTextContent('Invalid provider access token');
  expect(localStorage.getItem(AUTH_TOKEN_NAME)).toBeNull();
  expect(screen.queryByRole('heading', { name: 'Authenticated dashboard' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: 'Sign in again' }));
  expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
});

test('a successful HTTP response without a JWT cannot authenticate', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify({ user: { id: 1 } }), { status: 200 }))
  );
  renderCallback();

  expect(await screen.findByRole('alert')).toHaveTextContent('Authentication response did not include a valid token');
  expect(localStorage.getItem(AUTH_TOKEN_NAME)).toBeNull();
  expect(screen.queryByRole('heading', { name: 'Authenticated dashboard' })).not.toBeInTheDocument();
});

test('previously serialized undefined credentials no longer bypass the login page', () => {
  localStorage.setItem(AUTH_TOKEN_NAME, 'undefined');
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
  expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  expect(localStorage.getItem(AUTH_TOKEN_NAME)).toBeNull();
});
