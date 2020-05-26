import React, { useState } from 'react';
import Button from './button';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

export const TODO_FRAGMENT = gql`
  fragment TodoFragment on Todo {
    __typename
    id
    sheetId
    text
    isChecked
  }
`;

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
  const [deleteTodo, { error }] = useMutation(DELETE_TODO);
  const [isChecked, setIsChecked] = useState(props.isChecked);
  const [text, setText] = useState(props.text);
  const [isEditingText, setIsEditingText] = useState(false);

  if (error) return <h1>An error has occurred</h1>;

  return (
    <li>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsEditingText(false);
        }}
      >
        {isEditingText ? (
          <input
            ref={(ref) => ref && ref.focus()}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => setIsEditingText(false)}
          />
        ) : (
          <p onClick={() => setIsEditingText(true)}>{text === '' ? 'todo' : text}</p>
        )}
      </form>
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
