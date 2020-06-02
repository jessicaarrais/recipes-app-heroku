import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import Button from './Button';
import Settings from '../pages/Settings';

function NavigationBar() {
  const client = useApolloClient();

  const handleLogout = () => {
    localStorage.clear();
    client.cache.reset();
    client.writeData({
      data: { isLoggedIn: false, notebook: [] },
    });
  };

  return (
    <nav>
      <Button type="button" handleOnClick={handleLogout}>
        Logout
      </Button>
      <Settings />
    </nav>
  );
}

export default NavigationBar;
