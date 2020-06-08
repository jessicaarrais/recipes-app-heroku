import React, { CSSProperties } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import Settings from '../pages/Settings';
import Button from './Button';

const nav: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'right',
  boxShadow: '0 0 3px 0 gray',
};

interface Props {
  username: string;
}

function NavigationBar(props: Props) {
  const client = useApolloClient();

  const handleLogout = () => {
    localStorage.clear();
    client.cache.reset();
    client.writeData({ data: { isLoggedIn: false } });
  };

  return (
    <nav style={nav}>
      <h3>{props.username}</h3>
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
