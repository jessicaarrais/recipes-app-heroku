import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { useHistory } from 'react-router';
import Button from '../components/Button';
import DeleteUserButton from '../components/DeleteUserButton';
import { Link } from 'react-router-dom';

function Settings() {
  const client = useApolloClient();
  const history = useHistory();

  const handleLogout = () => {
    localStorage.clear();
    client.cache.reset();
    client.writeData({ data: { isLoggedIn: false } });
    history.push('/');
  };

  return (
    <>
      <Link to="/home">Back to Home</Link>
      <DeleteUserButton />
      <Button type="button" styleType="default" handleOnClick={handleLogout}>
        Logout
      </Button>
    </>
  );
}

export default Settings;
