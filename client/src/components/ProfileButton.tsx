import React from 'react';
import { Link } from 'react-router-dom';
import standartAvatar from './../assets/img/chinchilla.jpg';

interface Props {
  username: string;
  uri?: string;
}

function ProfileButton(props: Props) {
  return (
    <Link to={`/users/${props.username}`} className="nav-link">
      <span className="nav-span-username">{props.username}</span>
      <img
        className="nav-avatar"
        alt="user's avatar"
        src={props.uri ? props.uri : standartAvatar}
      />
    </Link>
  );
}

export default ProfileButton;
