import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Button from './button';

export const TODO_FRAGMENT = gql`
  fragment TodoFragment on Todo {
    __typename
    id
    sheetId
    text
    isChecked
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($todoId: ID!, $text: String, $isChecked: Boolean, $sheetId: ID!) {
    updateTodo(todoId: $todoId, text: $text, isChecked: $isChecked, sheetId: $sheetId) {
      todo {
        ...TodoFragment
      }
    }
  }
  ${TODO_FRAGMENT}
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
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [deleteTodo, { error }] = useMutation(DELETE_TODO);
  const [newText, setNewText] = useState(props.text);
  const [isEditingText, setIsEditingText] = useState(false);

  const handleUpdateTodoCheckbox = (isChecked: boolean): void => {
    if (isChecked !== props.isChecked) {
      updateTodo({
        variables: {
          todoId: props.id,
          isChecked,
          sheetId: props.sheetId,
        },
      });
    }
  };

  const handleUpdateTodoText = (text: string): void => {
    setIsEditingText(false);
    if (text !== props.text) {
      updateTodo({
        variables: {
          todoId: props.id,
          text,
          sheetId: props.sheetId,
        },
      });
    }
  };

  if (error) return <h1>An error has occurred. ${error.message}</h1>;

  return (
    <li>
      <input
        type="checkbox"
        checked={props.isChecked}
        onChange={(e) => {
          handleUpdateTodoCheckbox(e.target.checked);
        }}
      />
      {isEditingText ? (
        <input
          ref={(ref) => ref && ref.focus()}
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleUpdateTodoText(newText);
          }}
          onBlur={() => handleUpdateTodoText(newText)}
        />
      ) : (
        <p
          onClick={() => {
            setIsEditingText(true);
            setNewText(props.text);
          }}
        >
          {props.text}
        </p>
      )}
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
