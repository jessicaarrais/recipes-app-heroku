import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import Button from './Button';

function NavigationBar() {
  const client = useApolloClient();

  const handleOnClick = () => {
    localStorage.clear();
    client.writeData({
      data: { isLoggedIn: false, notebook: [] },
    });
  };

  return (
    <nav>
      <Button type="button" handleOnClick={handleOnClick}>
        Logout
      </Button>
    </nav>
  );
}

export default NavigationBar;
