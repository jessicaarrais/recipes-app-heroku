import React from 'react';
import { Link } from 'react-router-dom';
import standartAvatar from './../assets/img/chinchilla.jpg';
import '../assets/css/navigationbar.css';
import { Search } from './Search';

interface Props {
  username: string;
  uri?: string;
}

function NavigationBar(props: Props) {
  return (
    <nav className="navbar">
      <Search />
      <Link to="/account-settings" className="nav-link">
        <span className="nav-span-username">{props.username}</span>
        <img
          className="nav-avatar"
          alt="user's avatar"
          src={props.uri ? props.uri : standartAvatar}
        />
      </Link>
    </nav>
  );
}

export default NavigationBar;
