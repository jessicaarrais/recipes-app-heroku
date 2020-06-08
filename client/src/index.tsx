import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import ApolloClient from 'apollo-client';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import gql from 'graphql-tag';
import { typeDefs } from './resolvers';
import LoggedIn from './pages/LoggedIn';
import LoggedOut from './pages/LoggedOut';

const httpLink = createHttpLink({ uri: 'http://localhost:4000/graphql' });
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: localStorage.getItem('token'),
      'client-name': 'todo-app',
      'client-version': '1.0.0',
    },
  };
});

const cache = new InMemoryCache();
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  typeDefs,
  resolvers: {},
});

cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem('token'),
  },
});

const IS_LOGGED_IN = gql`
  query IsLoggedIn {
    isLoggedIn @client
  }
`;

function LandingPage() {
  const { data } = useQuery(IS_LOGGED_IN);

  return data.isLoggedIn ? <LoggedIn /> : <LoggedOut />;
}

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <LandingPage />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
