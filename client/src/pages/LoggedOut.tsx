import React, { CSSProperties, useState } from 'react';
import Login from '../components/Login';
import Signin from '../components/Signin';
import Button from '../components/Button';

const section: CSSProperties = {
  width: '100%',
  maxWidth: '968px',
  margin: '0 auto',
};

function LoggedOut() {
  const [login, setLogin] = useState(false);
  const [signin, setSignin] = useState(false);
  return (
    <section style={section}>
      <h1>Recipes</h1>
      <Button
        type="button"
        styleType="default"
        handleOnClick={() => {
          setLogin(true);
          setSignin(false);
        }}
      >
        Login
      </Button>
      <Button
        type="button"
        styleType="default"
        handleOnClick={() => {
          setSignin(true);
          setLogin(false);
        }}
      >
        Signin
      </Button>
      {login && <Login />}
      {signin && <Signin />}
    </section>
  );
}

export default LoggedOut;
