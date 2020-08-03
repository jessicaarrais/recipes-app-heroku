import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import Button from './Button';
import '../assets/css/login-signup.css';

const CREATE_USER = gql`
  mutation CreateUser($email: String!, $username: String!) {
    signin(email: $email, username: $username) {
      __typename
      success
      message
      me {
        username
        token
      }
    }
  }
`;

function Signin() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [emailInputSignin, setEmailInputSignin] = useState('');
  const [usernameInputSignin, setUsernameInputSignin] = useState('');
  const client = useApolloClient();

  const [signin, { error, loading }] = useMutation(CREATE_USER, {
    onCompleted(data) {
      if (!data.signin.success) {
        setErrorMessage(data.signin.message);
        return;
      }
      localStorage.setItem('token', data.signin.me.token);
      client.writeData({ data: { isLoggedIn: true } });
    },
  });

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>An error has ocurred</h1>;

  return (
    <div className="login-signup-card">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signin({
            variables: { email: emailInputSignin, username: usernameInputSignin },
          });
        }}
      >
        <input
          className="login-signup-input"
          placeholder="E-mail"
          value={emailInputSignin}
          onChange={(e) => {
            setEmailInputSignin(e.target.value);
          }}
        />
        <input
          className="login-signup-input"
          placeholder="Username"
          value={usernameInputSignin}
          onChange={(e) => {
            setUsernameInputSignin(e.target.value);
          }}
        />
        <div className="login-signup-btn">
          <Button type="submit" actionType="default">
            Signin
          </Button>
        </div>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default Signin;
