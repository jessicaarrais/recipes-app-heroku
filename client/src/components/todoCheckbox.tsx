import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const UPDATE_TODO = gql`
  mutation UpdateTodo($todoId: ID!, $text: String, $isChecked: Boolean, $sheetId: ID!) {
    updateTodo(todoId: $todoId, text: $text, isChecked: $isChecked, sheetId: $sheetId) {
      todo {
        id
        sheetId
        text
        isChecked
      }
    }
  }
`;

interface Props {
  todoId: number;
  isChecked: boolean;
  sheetId: number;
}

function TodoCheckbox(props: Props) {
  const [updateTodo, { error }] = useMutation(UPDATE_TODO);

  const handleUpdateTodoCheckbox = (isChecked: boolean): void => {
    if (isChecked !== props.isChecked) {
      updateTodo({
        variables: { todoId: props.todoId, isChecked, sheetId: props.sheetId },
      });
    }
  };

  if (error) return <h1>An error has occurred. ${error.message}</h1>;

  return (
    <input
      type="checkbox"
      checked={props.isChecked}
      onChange={(e) => {
        handleUpdateTodoCheckbox(e.target.checked);
      }}
    />
  );
}

export default TodoCheckbox;
