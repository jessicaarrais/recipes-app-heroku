import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import User from '../components/User';

interface Props {
  username: string;
  uri?: string;
}

function Settings(props: Props) {
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
      <Button type="button" styleType="default" handleOnClick={handleLogout}>
        Logout
      </Button>
      <User username={props.username} uri={props.uri} />
    </>
  );
}

export default Settings;
