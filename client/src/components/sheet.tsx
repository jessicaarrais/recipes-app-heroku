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

const UPDATE_SHEET = gql`
  mutation UpdateSheet($sheetId: ID!, $title: String, $notebookId: ID!) {
    updateSheet(sheetId: $sheetId, title: $title, notebookId: $notebookId) {
      sheet {
        id
        title
      }
    }
  }
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
  const [updateSheet] = useMutation(UPDATE_SHEET);
  const [deleteSheet, { error }] = useMutation(DELETE_SHEET);
  const [createTodo] = useMutation(CREATE_TODO);
  const [newTitle, setNewTitle] = useState(props.title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleUpdateSheetTitle = (title: string): void => {
    setIsEditingTitle(false);
    if (title !== props.title) {
      updateSheet({
        variables: { sheetId: props.id, title, notebookId: props.notebookId },
      });
    }
  };

  if (error) return <h1>An error has occurred. ${error.message}</h1>;
  return (
    <li>
      {isEditingTitle ? (
        <input
          ref={(ref) => {
            ref && ref.focus();
          }}
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleUpdateSheetTitle(newTitle);
          }}
          onBlur={() => handleUpdateSheetTitle(newTitle)}
        />
      ) : (
        <h2
          onClick={() => {
            setIsEditingTitle(true);
            setNewTitle(props.title);
          }}
        >
          {props.title}
        </h2>
      )}
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
