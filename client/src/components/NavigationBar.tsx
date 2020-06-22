import React, { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import standartAvatar from './../assets/img/chinchilla.jpg';

const nav: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'right',
  padding: '16px',
  boxShadow: '0 0 3px 0 gray',
};
const link: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  textDecoration: 'none',
};
const username: CSSProperties = {
  margin: '0',
  fontWeight: 'bold',
};
const avatar: CSSProperties = {
  marginLeft: '16px',
  width: '32px',
  height: '32px',
  objectFit: 'cover',
  fontSize: '12px',
  boxShadow: '0 0 0 2px hotpink',
};

interface Props {
  username: string;
  uri?: string;
}

function NavigationBar(props: Props) {
  return (
    <nav style={nav}>
      <Link to="/account-settings" style={link}>
        <span style={username}>{props.username}</span>
        <img
          alt="user's avatar"
          src={props.uri ? props.uri : standartAvatar}
          style={avatar}
        />
      </Link>
    </nav>
  );
}

export default NavigationBar;
