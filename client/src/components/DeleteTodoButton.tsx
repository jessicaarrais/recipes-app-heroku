import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Button from './Button';
import Icon from './Icon';

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
    <Button
      type="button"
      actionType="danger"
      handleOnClick={() => deleteTodo({ variables: props })}
    >
      <Icon icon="clear" />
    </Button>
  );
}

export default DeleteTodoButton;
