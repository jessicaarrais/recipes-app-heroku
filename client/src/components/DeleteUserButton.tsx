import React from 'react';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Button from './Button';

const DELETE_USER = gql`
  mutation DeleteUser {
    deleteUser {
      user {
        id
        email
      }
    }
  }
`;

function DeleteUserButton() {
  const client = useApolloClient();
  const [deleteUser, { loading, error }] = useMutation(DELETE_USER, {
    onCompleted() {
      localStorage.clear();
      client.cache.reset();
      client.writeData({ data: { isLoggedIn: false, notebook: [] } });
    },
  });

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>An error has occurred. ${error.message}</h1>;

  return (
    <div>
      <Button
        type="button"
        styleType="danger"
        icon="delete_forever"
        handleOnClick={() => deleteUser()}
      >
        delete account
      </Button>
    </div>
  );
}

export default DeleteUserButton;
