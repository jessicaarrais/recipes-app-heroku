import React, { useState } from 'react';
import Button from '../components/Button';
import Login from '../components/Login';
import Signin from '../components/Signup';

function HomeLoggedOut() {
  const [login, setLogin] = useState(false);
  const [signin, setSignin] = useState(false);

  return (
    <>
      <h1>Cookbook</h1>
      <div>
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
      </div>
      <div>
        {login && <Login />}
        {signin && <Signin />}
      </div>
    </>
  );
}

export default HomeLoggedOut;
