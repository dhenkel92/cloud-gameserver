import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { SetContextLink } from '@apollo/client/link/context';
import { App } from './components/app/App';
import { StorageAdapter } from './StorageAdapter';

const authLink = new SetContextLink(({ headers }) => {
  const token = StorageAdapter.getInstance().getAuthToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const httpLink = new HttpLink({
  uri: `${import.meta.env.REACT_APP_API_URL ?? 'http://localhost:1337'}/graphql`,
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

const root = createRoot(document.getElementById('root')!);
root.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>
);
