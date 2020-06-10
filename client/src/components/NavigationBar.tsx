import React, { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

const nav: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'right',
  boxShadow: '0 0 3px 0 gray',
};
const userInfo: CSSProperties = {
  cursor: 'pointer',
};

interface Props {
  username: string;
}

function NavigationBar(props: Props) {
  return (
    <nav style={nav}>
      <Link to="/account-settings">
        <h3>{props.username}</h3>
        <img alt="user's avatar" />
      </Link>
    </nav>
  );
}

export default NavigationBar;
