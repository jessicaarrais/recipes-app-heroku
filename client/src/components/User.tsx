import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import DeleteUserButton from '../components/DeleteUserButton';

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
}

function User(props: Props) {
  const [newUsername, setNewUsername] = useState(props.username);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [updateUser, { data, loading, error }] = useMutation(UPDATE_USER, {
    onCompleted(data) {
      if (!data.updateUser.success) {
        setErrorMessage(data.updateUser.message);
      }
    },
  });

  const handleUserUpdate = (username: string): void => {
    setIsEditing(false);
    if (props.username !== username) {
      updateUser({ variables: { username } });
    }
  };

  return (
    <>
      {isEditing ? (
        <input
          ref={(ref) => ref && ref.focus()}
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleUserUpdate(newUsername);
          }}
          onBlur={() => handleUserUpdate(newUsername)}
        />
      ) : (
        <p
          onClick={() => {
            setIsEditing(true);
            setNewUsername(props.username);
          }}
        >
          {props.username}
        </p>
      )}
      {errorMessage && <p>{errorMessage}</p>}
      <DeleteUserButton />
    </>
  );
}

export default User;
