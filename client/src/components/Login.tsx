import React, { useState } from 'react';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Button from '../components/Button';
import '../assets/css/login-signup.css';

const LOGIN = gql`
  mutation Login($email: String!) {
    login(email: $email) {
      success
      message
      user {
        username
        token
      }
    }
  }
`;

function Login() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [inputLogin, setInputLogin] = useState('');
  const client = useApolloClient();

  const [login, { loading, error }] = useMutation(LOGIN, {
    onCompleted(data) {
      if (!data.login.success) {
        setErrorMessage(data.login.message);
        return;
      }
      localStorage.setItem('token', data.login.user.token);
      client.writeData({ data: { isLoggedIn: true } });
    },
  });

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>An error has ocurred</h1>;

  return (
    <div className="login-signup-card">
      <form
        onSubmit={() => {
          login({ variables: { email: inputLogin } });
        }}
      >
        <input
          className="login-signup-input"
          placeholder="E-mail"
          value={inputLogin}
          onChange={(e) => {
            setInputLogin(e.target.value);
          }}
        />
        <div className="login-signup-btn">
          <Button type="submit" styleType="default">
            Login
          </Button>
        </div>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default Login;
