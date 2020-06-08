import React, { CSSProperties } from 'react';
import Login from './Login';
import Signin from './Signin';

const page: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
};

function LoggedOut() {
  return (
    <div style={page}>
      <Login />
      <Signin />
    </div>
  );
}

export default LoggedOut;
