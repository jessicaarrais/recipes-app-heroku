import React, { useState, CSSProperties } from 'react';
import gql from 'graphql-tag';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import Button from '../components/Button';

export const card: CSSProperties = {
  width: '400px',
  height: '320px',
  margin: '32px',
  border: 'solid 1px gray',
  borderRadius: '16px',
};
export const input: CSSProperties = {
  display: 'block',
  width: '240px',
  height: '28px',
  margin: '10% auto',
  border: 'solid 1px gray',
  borderRadius: '2px',
};
export const btn: CSSProperties = {
  display: 'block',
};

const CREATE_USER = gql`
  mutation CreateUser($email: String!, $username: String!) {
    signin(email: $email, username: $username) {
      __typename
      success
      message
      user {
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
      localStorage.setItem('token', data.signin.user.token);
      client.writeData({ data: { isLoggedIn: true } });
    },
  });

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>An error has ocurred</h1>;

  return (
    <div style={card}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signin({
            variables: { email: emailInputSignin, username: usernameInputSignin },
          });
        }}
      >
        <input
          placeholder="E-mail"
          value={emailInputSignin}
          style={input}
          onChange={(e) => {
            setEmailInputSignin(e.target.value);
          }}
        />
        <input
          placeholder="Username"
          value={usernameInputSignin}
          style={input}
          onChange={(e) => {
            setUsernameInputSignin(e.target.value);
          }}
        />
        <div style={btn}>
          <Button type="submit" styleType="default">
            Signin
          </Button>
        </div>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default Signin;
