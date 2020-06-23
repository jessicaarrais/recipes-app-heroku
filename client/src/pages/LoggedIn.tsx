import React, { CSSProperties } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { SHEET_FRAGMENT } from '../components/Sheet';
import NavigationBar from '../components/NavigationBar';
import Home from './Home';
import { Route, Switch, Redirect } from 'react-router';
import Settings from './Settings';

const section: CSSProperties = {
  width: '100%',
  maxWidth: '968px',
  margin: '0 auto',
};

export const NOTEBOOK_FRAGMENT = gql`
  fragment NotebookFragment on Notebook {
    __typename
    id
    sheets {
      ...SheetFragment
    }
  }
  ${SHEET_FRAGMENT}
`;

export const GET_NOTEBOOK = gql`
  query User {
    user {
      id
      username
      avatar {
        uri
      }
      notebook {
        ...NotebookFragment
      }
    }
  }
  ${NOTEBOOK_FRAGMENT}
`;

function LoggedIn() {
  const { data, loading, error } = useQuery(GET_NOTEBOOK);

  if (loading) return <h1>Loading...</h1>;
  // if (error) return <h1>An error has occurred. ${error.message}</h1>;

  return (
    <div>
      <NavigationBar username={data.user.username} uri={data.user.avatar?.uri} />
      <section style={section}>
        <Switch>
          <Redirect exact from="/" to="/home" />
          <Route
            path="/home"
            render={() => (
              <Home
                notebookId={data.user.notebook.id}
                sheets={data.user.notebook.sheets}
              />
            )}
          />
          <Route
            path="/account-settings"
            render={() => (
              <Settings username={data.user.username} uri={data.user.avatar?.uri} />
            )}
          />
        </Switch>
      </section>
    </div>
  );
}

export default LoggedIn;
