import React from 'react';
import gql from 'graphql-tag';
import DeleteTodoButton from './DeleteTodoButton';
import TodoCheckbox from './TodoCheckbox';
import TodoText from './TodoText';

export const TODO_FRAGMENT = gql`
  fragment TodoFragment on Todo {
    __typename
    id
    sheetId
    text
    isChecked
  }
`;

interface Props {
  id: number;
  sheetId: number;
  isChecked: boolean;
  text: string;
}

function Todo(props: Props) {
  return (
    <li>
      <TodoCheckbox
        todoId={props.id}
        isChecked={props.isChecked}
        sheetId={props.sheetId}
      />
      <TodoText todoId={props.id} text={props.text} sheetId={props.sheetId} />
      <DeleteTodoButton todoId={props.id} sheetId={props.sheetId} />
    </li>
  );
}

export default Todo;
