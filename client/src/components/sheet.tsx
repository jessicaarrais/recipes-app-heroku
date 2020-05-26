import React, { useState } from 'react';
import gql from 'graphql-tag';
import Todo, { TODO_FRAGMENT } from './todo';
import Button from './button';
import { useMutation } from '@apollo/react-hooks';

export const SHEET_FRAGMENT = gql`
  fragment SheetFragment on Sheet {
    __typename
    id
    notebookId
    title
    todos {
      ...TodoFragment
    }
  }
  ${TODO_FRAGMENT}
`;

const DELETE_SHEET = gql`
  mutation DeleteSheet($sheetId: ID!, $notebookId: ID!) {
    deleteSheet(sheetId: $sheetId, notebookId: $notebookId) {
      notebook {
        id
        sheets {
          id
        }
      }
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($text: String, $isChecked: Boolean, $sheetId: ID!) {
    createTodo(text: $text, isChecked: $isChecked, sheetId: $sheetId) {
      success
      message
      sheet {
        ...SheetFragment
      }
    }
  }
  ${SHEET_FRAGMENT}
`;

interface SheetPropsType {
  id: number;
  notebookId: number;
  title: string;
  todos: [];
}

function Sheet(props: SheetPropsType) {
  const [deleteSheet, { error }] = useMutation(DELETE_SHEET);
  const [createTodo] = useMutation(CREATE_TODO);
  const [title, setTitle] = useState(props.title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  if (error) return <h1>An error has ocurred</h1>;

  return (
    <li>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsEditingTitle(false);
        }}
      >
        {isEditingTitle ? (
          <input
            ref={(ref) => {
              ref && ref.focus();
            }}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
          />
        ) : (
          <h2 onClick={() => setIsEditingTitle(true)}>
            {title === '' ? 'Title' : title}
          </h2>
        )}
      </form>
      <ul>
        {props.todos.map((todo: any) => (
          <Todo
            key={todo.id}
            id={todo.id}
            sheetId={todo.sheetId}
            isChecked={todo.isChecked}
            text={todo.text}
          />
        ))}
      </ul>
      <Button
        type="button"
        handleOnClick={() =>
          createTodo({ variables: { text: 'todo', isChecked: false, sheetId: props.id } })
        }
      >
        New Todo
      </Button>
      <Button
        type="button"
        handleOnClick={() => {
          deleteSheet({
            variables: { sheetId: props.id, notebookId: props.notebookId },
          });
        }}
      >
        delete sheet
      </Button>
    </li>
  );
}

export default Sheet;
