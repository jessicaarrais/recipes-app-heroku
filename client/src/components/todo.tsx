import React, { useState } from 'react';
import Button from './button';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

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

interface TodoPropsType {
  id: number;
  sheetId: number;
  isChecked: boolean;
  text: string;
}

function Todo(props: TodoPropsType) {
  const [isChecked, setIsChecked] = useState(props.isChecked);

  const [deleteTodo, { loading, error }] = useMutation(DELETE_TODO);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>An error has ocurred</h1>;

  return (
    <li>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
      />
      <p>{props.text}</p>
      <Button
        type="button"
        handleOnClick={() => {
          deleteTodo({ variables: { todoId: props.id, sheetId: props.sheetId } });
        }}
      >
        delete todo
      </Button>
    </li>
  );
}

export default Todo;
