import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { SHEET_FRAGMENT } from '../components/Sheet';
import NavigationBar from '../components/NavigationBar';
import Home from './Home';

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
      username
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
      <NavigationBar username={data.user.username} />
      <Home notebookId={data.user.notebook.id} sheets={data.user.notebook.sheets} />
    </div>
  );
}

export default LoggedIn;
