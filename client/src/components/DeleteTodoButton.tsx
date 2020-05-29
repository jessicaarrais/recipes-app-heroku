import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Button from './Button';

const DELETE_TODO = gql`
  mutation DeleteTodo($todoId: ID!, $sheetId: ID!) {
    deleteTodo(todoId: $todoId, sheetId: $sheetId) {
      sheet {
        id
        todos {
          id
        }
      }
    }
  }
`;

interface Props {
  todoId: number;
  sheetId: number;
}

function DeleteTodoButton(props: Props) {
  const [deleteTodo, { error }] = useMutation(DELETE_TODO);

  if (error) return <h1>An error has occurred. ${error.message}</h1>;

  return (
    <Button type="button" handleOnClick={() => deleteTodo({ variables: props })}>
      delete todo
    </Button>
  );
}

export default DeleteTodoButton;
