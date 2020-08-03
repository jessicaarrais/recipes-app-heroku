import * as serviceWorker from './serviceWorker';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-client';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from 'apollo-link-context';
import { typeDefs } from './resolvers';
import LoggedIn from './pages/LoggedInRoute';
import LoggedOut from './pages/LoggedOutRoute';
import './index.css';
import Button from './components/Button';
import Icon from './components/Icon';

const httpLink = createUploadLink({ uri: 'http://localhost:4000/graphql' });
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: localStorage.getItem('token'),
      'client-name': 'recipes-app',
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

const history = createBrowserHistory();

const IS_LOGGED_IN = gql`
  query IsLoggedIn {
    isLoggedIn @client
  }
`;

function LandingPage() {
  const [isShowingArrowUp, setIsShowingArrowUp] = useState('hidden');

  const { data } = useQuery(IS_LOGGED_IN);

  const handleScroll = () => {
    if (window.scrollY <= 260) {
      setIsShowingArrowUp('hidden');
    } else {
      setIsShowingArrowUp('showed');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  return (
    <>
      {data.isLoggedIn ? <LoggedIn /> : <LoggedOut />}
      <div className={`back-to-top-icon ${isShowingArrowUp}`} title="back to top">
        <Button
          type="button"
          actionType="default"
          handleOnClick={() => {
            window.scrollTo(0, 0);
          }}
        >
          <Icon icon="keyboard_arrow_up" />
        </Button>
      </div>
    </>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router history={history}>
        <LandingPage />
      </Router>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
