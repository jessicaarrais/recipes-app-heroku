import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import Button from './button';

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
      <Button handleOnClick={handleOnClick}>Logout</Button>
    </nav>
  );
}

export default NavigationBar;
