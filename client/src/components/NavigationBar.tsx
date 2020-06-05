import React, { CSSProperties } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import Button from './Button';
import Settings from '../pages/Settings';

const nav: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'right',
  boxShadow: '0 0 3px 0 gray',
};

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
    <nav style={nav}>
      <Button styleType="default" icon="menu" />
      <Button
        type="button"
        styleType="default"
        handleOnClick={handleLogout}
        handleOnKeyDown={(e) => {
          if (e.key === 'Enter') handleLogout();
        }}
      >
        Logout
      </Button>
      <Settings />
    </nav>
  );
}

export default NavigationBar;
