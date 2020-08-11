import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import DeleteUserButton from './DeleteUserButton';
import Avatar from './Avatar';
import EditableTextArea from './EditableTextArea';

const UPDATE_USER = gql`
  mutation UpdateUser($username: String) {
    updateUser(username: $username) {
      success
      message
      me {
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

function UserSettings(props: Props) {
  const [errorMessage, setErrorMessage] = useState(null);

  const [updateUser, { error }] = useMutation(UPDATE_USER, {
    onCompleted(data) {
      if (!data.updateUser.success) {
        setErrorMessage(data.updateUser.message);
      } else {
        setErrorMessage(null);
      }
    },
  });

  const onSubmit = (username: string): void => {
    updateUser({ variables: { username } });
  };

  if (error) return <h1>An error has occurred. ${error.message}</h1>;

  return (
    <>
      <EditableTextArea semanticalType="p" onSubmit={onSubmit}>
        {props.username}
      </EditableTextArea>
      <p>{errorMessage}</p>
      <Avatar uri={props.uri} />
      <DeleteUserButton />
    </>
  );
}

export default UserSettings;
