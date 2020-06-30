import React, { useState } from 'react';
import Login from '../components/Login';
import Signin from '../components/Signin';
import Button from '../components/Button';
import '../assets/css/loggedout.css';

function LoggedOut() {
  const [login, setLogin] = useState(false);
  const [signin, setSignin] = useState(false);
  return (
    <section className="loggedout-section">
      <h1>Recipes</h1>
      <Button
        type="button"
        actionType="default"
        handleOnClick={() => {
          setLogin(true);
          setSignin(false);
        }}
      >
        Login
      </Button>
      <Button
        type="button"
        actionType="default"
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
