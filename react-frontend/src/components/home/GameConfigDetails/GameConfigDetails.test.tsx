import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { GameConfigList, GAME_CONFIGS } from '../GameConfigList/GameConfigList';
import { GameConfigDetails } from './GameConfigDetails';
import { GAME_CONFIG_DETAILS, GameConfigDetailsResponse } from './GameConfigDetailQuery';
import { CREATE_GAME_DEPLOY, STOP_GAME_DEPLOY } from './GameConfigButtons/GameConfigButtons';

const instanceDocumentId = 'instance-document';
const cloudDocumentId = 'cloud-document';
const deploymentDocumentId = 'deployment-document';

const detailsFixture = (status: string): GameConfigDetailsResponse => ({
  gameInstance: {
    documentId: instanceDocumentId,
    name: 'Friends server',
    game_version: { version: '1.21', game_flavour: { name: 'Vanilla' }, game: { name: 'Minecraft' } },
    game_deployments: [
      {
        documentId: deploymentDocumentId,
        status,
        public_ip: '203.0.113.10',
        private_ip: '10.0.0.10',
        domain: 'games.example.com',
        start_time: '2026-10-01T12:00:00.000Z',
        stop_time: status === 'STOPPED' ? '2026-10-01T13:00:00.000Z' : null,
        cost_per_hour: 0.2,
        game_server_ports: [{ port: 25565, protocol: 'TCP', is_open: true }],
        cloud_instance: { documentId: cloudDocumentId, name: 'Small cloud server', cpu: '2', memory: '4 GB' },
      },
    ],
  },
  cloudInstances: [{ documentId: cloudDocumentId }],
});

const detailsMock = (status: string, maxUsageCount = 1): MockedResponse<GameConfigDetailsResponse> => ({
  request: { query: GAME_CONFIG_DETAILS, variables: { documentId: instanceDocumentId } },
  result: { data: detailsFixture(status) },
  maxUsageCount,
  delay: 0,
});

const detailsRoute = (
  <MemoryRouter initialEntries={[`/config/${instanceDocumentId}`]}>
    <Routes>
      <Route path="/config/:id" element={<GameConfigDetails />} />
    </Routes>
  </MemoryRouter>
);

test('renders flat dashboard records and links to the instance documentId', async () => {
  render(
    <MockedProvider
      mocks={[
        {
          request: { query: GAME_CONFIGS },
          result: { data: { gameInstances: [detailsFixture('RUNNING').gameInstance] } },
          delay: 0,
        },
      ]}
    >
      <MemoryRouter>
        <GameConfigList />
      </MemoryRouter>
    </MockedProvider>
  );

  expect(await screen.findByText('Friends server')).toBeInTheDocument();
  expect(screen.getByText('Minecraft')).toBeInTheDocument();
  expect(screen.getByText('RUNNING')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Configure' })).toHaveAttribute('href', `/config/${instanceDocumentId}`);
});

test('starts a deployment using string documentIds for both relations and refetches its status', async () => {
  render(
    <MockedProvider
      mocks={[
        detailsMock('STOPPED'),
        {
          request: {
            query: CREATE_GAME_DEPLOY,
            variables: (variables: Record<string, unknown>) =>
              variables.gameInstanceId === instanceDocumentId &&
              variables.cloudInstanceId === cloudDocumentId &&
              typeof variables.time === 'string' &&
              !Number.isNaN(Date.parse(variables.time)),
          },
          result: { data: { createGameDeployment: { documentId: deploymentDocumentId, status: 'STARTING' } } },
          delay: 0,
        },
        detailsMock('STARTING', Infinity),
      ]}
    >
      {detailsRoute}
    </MockedProvider>
  );

  fireEvent.click(await screen.findByRole('button', { name: 'Start' }));
  expect((await screen.findAllByText('STARTING')).length).toBeGreaterThan(0);
  expect(screen.queryByRole('button', { name: 'Start' })).not.toBeInTheDocument();
});

test('renders native custom ports and stops the latest deployment by documentId', async () => {
  render(
    <MockedProvider
      mocks={[
        detailsMock('RUNNING'),
        {
          request: { query: STOP_GAME_DEPLOY, variables: { documentId: deploymentDocumentId } },
          result: { data: { updateGameDeployment: { documentId: deploymentDocumentId, status: 'STOPPING' } } },
          delay: 0,
        },
        detailsMock('STOPPING', Infinity),
      ]}
    >
      {detailsRoute}
    </MockedProvider>
  );

  expect(await screen.findByText('25565/TCP')).toBeInTheDocument();
  expect(screen.getByText('games.example.com')).toBeInTheDocument();
  expect(screen.getByText('203.0.113.10')).toBeInTheDocument();
  expect(screen.getByText('10.0.0.10')).toBeInTheDocument();
  expect(screen.getByText('Small cloud server')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Stop' }));
  expect((await screen.findAllByText('STOPPING')).length).toBeGreaterThan(0);
  expect(screen.queryByRole('button', { name: 'Stop' })).not.toBeInTheDocument();
});

test('polls flat deployment status until a starting server is running', async () => {
  render(<MockedProvider mocks={[detailsMock('STARTING'), detailsMock('RUNNING', Infinity)]}>{detailsRoute}</MockedProvider>);

  expect((await screen.findAllByText('STARTING')).length).toBeGreaterThan(0);
  expect(await screen.findByRole('button', { name: 'Stop' }, { timeout: 3000 })).toBeInTheDocument();
  expect(screen.getByText('25565/TCP')).toBeInTheDocument();
});
