import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {App} from './components/app/App';
import * as serviceWorker from './serviceWorker';
import {HttpLink, ApolloClient, InMemoryCache} from 'apollo-boost';
import {ApolloProvider} from '@apollo/react-hooks';
import {setContext} from "apollo-link-context";
import {StorageAdapter} from "./StorageAdapter";

const authLink = setContext((_, {headers}) => {
    const token = StorageAdapter.getInstance().getAuthToken();
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

const httpLink = new HttpLink({
    uri: 'https://api.cloud-game.app/graphql',
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
})

ReactDOM.render(
    <ApolloProvider client={client}>
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    </ApolloProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
