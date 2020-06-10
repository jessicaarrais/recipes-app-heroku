import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { useHistory } from 'react-router';
import Button from '../components/Button';
import DeleteUserButton from '../components/DeleteUserButton';

function Settings() {
  const client = useApolloClient();
  const history = useHistory();

  const handleLogout = () => {
    localStorage.clear();
    client.cache.reset();
    client.writeData({ data: { isLoggedIn: false } });
    history.push('/');
  };

  const navigateToHome = () => history.push('/home');

  return (
    <>
      <Button type="button" styleType="default" handleOnClick={navigateToHome}>
        Back to Home
      </Button>
      <DeleteUserButton />
      <Button type="button" styleType="default" handleOnClick={handleLogout}>
        Logout
      </Button>
    </>
  );
}

export default Settings;
