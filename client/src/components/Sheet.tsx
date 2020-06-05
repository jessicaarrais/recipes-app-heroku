import React, { CSSProperties } from 'react';
import gql from 'graphql-tag';
import Todo, { TODO_FRAGMENT } from './Todo';
import CreateTodoButton from './CreateTodoButton';
import DeleteSheetButton from './DeleteSheetButton';
import SheetTitle from './SheetTitle';

const li: CSSProperties = {
  width: '90%',
  maxWidth: '1000px',
  padding: '24px',
  margin: '16px',
  boxShadow: '1px 1px 3px 1px lightgray',
  borderRadius: '8px',
  listStyle: 'none',
};

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

interface Props {
  id: number;
  notebookId: number;
  title: string;
  todos: [];
}

function Sheet(props: Props) {
  return (
    <>
      <li style={li}>
        <SheetTitle id={props.id} notebookId={props.notebookId} title={props.title} />
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
        <CreateTodoButton text="todo" isChecked={false} sheetId={props.id} />
        <DeleteSheetButton sheetId={props.id} notebookId={props.notebookId} />
      </li>
    </>
  );
}

export default Sheet;
