import React from 'react';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import { useHistory } from 'react-router';
import gql from 'graphql-tag';
import Button from './Button';
import Icon from './Icon';

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
  const history = useHistory();
  const [deleteUser, { loading, error }] = useMutation(DELETE_USER, {
    onCompleted() {
      localStorage.clear();
      client.cache.reset();
      client.writeData({ data: { isLoggedIn: false, notebook: [] } });
      history.push('/');
    },
  });

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>An error has occurred. ${error.message}</h1>;

  return (
    <div>
      <Button type="button" actionType="danger" handleOnClick={() => deleteUser()}>
        <Icon icon="delete_forever" />
        delete account
      </Button>
    </div>
  );
}

export default DeleteUserButton;
