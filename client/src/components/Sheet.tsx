import React from 'react';
import gql from 'graphql-tag';
import Todo, { TODO_FRAGMENT } from './Todo';
import CreateTodoButton from './CreateTodoButton';
import DeleteSheetButton from './DeleteSheetButton';
import SheetTitle from './SheetTitle';
import '../assets/css/sheet.css';
import Button from './Button';
import Icon from './Icon';

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
    <li className="sheet-li">
      <div className="sheet-header">
        <SheetTitle id={props.id} notebookId={props.notebookId} title={props.title} />
        <div>
          <Button type="button" actionType="secondary">
            <Icon icon="favorite_border" />
          </Button>
        </div>
      </div>
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
      <div className="sheet-btns-container">
        <div className="create-todo-container">
          <CreateTodoButton text="todo" isChecked={false} sheetId={props.id} />
        </div>
        <div className="delete-sheet-container">
          <DeleteSheetButton sheetId={props.id} notebookId={props.notebookId} />
        </div>
      </div>
    </li>
  );
}

export default Sheet;
