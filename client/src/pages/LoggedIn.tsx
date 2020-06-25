import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Home from './Home';
import { SHEET_FRAGMENT } from '../components/Sheet';
import NavigationBar from '../components/NavigationBar';
import Settings from './Settings';
import '../assets/css/loggedin.css';
import Button from '../components/Button';

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
  if (error) return <h1>An error has occurred. ${error.message}</h1>;

  return (
    <div>
      <NavigationBar username={data.user.username} uri={data.user.avatar?.uri} />
      <section className="loggedin-section">
        <Switch>
          <Redirect exact from="/" to="/home" />
          <Route
            path="/home"
            render={() => (
              <>
                <Home
                  notebookId={data.user.notebook.id}
                  sheets={data.user.notebook.sheets}
                />
                <div className="back-to-top-icon">
                  <Button type="button" icon="keyboard_arrow_up" styleType="icon" />
                </div>
              </>
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
