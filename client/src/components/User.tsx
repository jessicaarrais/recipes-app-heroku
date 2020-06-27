import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import DeleteUserButton from '../components/DeleteUserButton';
import Avatar from './Avatar';
import EditableTextArea from './EditableTextArea';

const UPDATE_USER = gql`
  mutation UpdateUser($username: String) {
    updateUser(username: $username) {
      success
      message
      user {
        id
        username
      }
    }
  }
`;

interface Props {
  username: string;
  uri?: string;
}

function User(props: Props) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [updateUser, { error }] = useMutation(UPDATE_USER, {
    onCompleted(data) {
      if (!data.updateUser.success) {
        setErrorMessage(data.updateUser.message);
      }
    },
  });

  const onSubmit = (username: string): void => {
    updateUser({ variables: { username } });
  };

  if (error) return <h1>An error has occurred. ${error.message}</h1>;

  return (
    <>
      <EditableTextArea
        styleTypeInput="user-username-input"
        styleTypeSpan="user-username"
        onSubmit={onSubmit}
      >
        {props.username}
      </EditableTextArea>
      {errorMessage && <p>{errorMessage}</p>}
      <Avatar uri={props.uri} />
      <DeleteUserButton />
    </>
  );
}

export default User;
