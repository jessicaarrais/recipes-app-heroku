import React from 'react';
import gql from 'graphql-tag';
import Todo from './todo';
import Button from './button';
import { useMutation } from '@apollo/react-hooks';

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

interface SheetPropsType {
  id: number;
  notebookId: number;
  title: string;
  todos: [];
}

function Sheet(props: SheetPropsType) {
  const [deleteSheet, { loading, error }] = useMutation(DELETE_SHEET);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>An error has ocurred</h1>;

  return (
    <li>
      <h3>{props.title}</h3>
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
