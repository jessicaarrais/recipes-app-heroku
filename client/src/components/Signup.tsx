import React, { useState } from 'react';
import { gql, useMutation, useApolloClient } from '@apollo/client';
import Button from './Button';
import '../assets/css/login-signup.css';

const CREATE_USER = gql`
  mutation CreateUser($email: String!, $username: String!) {
    signup(email: $email, username: $username) {
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

function Signup() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [emailInputSignup, setEmailInputSignup] = useState('');
  const [usernameInputSignup, setUsernameInputSignup] = useState('');
  const client = useApolloClient();

  const [signup, { error, loading }] = useMutation(CREATE_USER, {
    onCompleted(data) {
      if (!data.signup.success) {
        setErrorMessage(data.signup.message);
        return;
      }
      localStorage.setItem('token', data.signup.me.token);
      client.cache.reset();
    },
  });

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>An error has ocurred</h1>;

  return (
    <div className="login-signup-card">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signup({
            variables: { email: emailInputSignup, username: usernameInputSignup },
          });
        }}
      >
        <input
          className="login-signup-input"
          placeholder="E-mail"
          value={emailInputSignup}
          onChange={(e) => {
            setEmailInputSignup(e.target.value);
          }}
        />
        <input
          className="login-signup-input"
          placeholder="Username"
          value={usernameInputSignup}
          onChange={(e) => {
            setUsernameInputSignup(e.target.value);
          }}
        />
        <div className="login-signup-btn">
          <Button type="submit" actionType="default">
            Signup
          </Button>
        </div>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default Signup;
