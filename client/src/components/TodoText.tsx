import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import EditableTextArea from './EditableTextArea';

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
  text: string;
  sheetId: number;
}

function TodoText(props: Props) {
  const [updateTodo, { error }] = useMutation(UPDATE_TODO);

  const onSubmit = (text: string): void => {
    updateTodo({
      variables: { todoId: props.todoId, text, sheetId: props.sheetId },
    });
  };

  if (error) return <h1>An error has occurred. ${error.message}</h1>;

  return (
    <EditableTextArea semanticalType="p" onSubmit={onSubmit}>
      {props.text}
    </EditableTextArea>
  );
}

export default TodoText;
