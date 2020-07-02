import React, { useState } from 'react';
import gql from 'graphql-tag';
import TodoCheckbox from './TodoCheckbox';
import TodoText from './TodoText';
import DeleteTodoButton from './DeleteTodoButton';
import '../assets/css/todo.css';

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
  const [isShowingDeleteTodoButton, setIsShowingDeleteTodoButton] = useState(false);
  return (
    <li
      className="todo-li"
      onMouseOver={() => setIsShowingDeleteTodoButton(true)}
      onMouseLeave={() => setIsShowingDeleteTodoButton(false)}
    >
      <TodoCheckbox
        todoId={props.id}
        isChecked={props.isChecked}
        sheetId={props.sheetId}
      />
      <TodoText todoId={props.id} text={props.text} sheetId={props.sheetId} />
      {isShowingDeleteTodoButton && (
        <div>
          <DeleteTodoButton todoId={props.id} sheetId={props.sheetId} />
        </div>
      )}
    </li>
  );
}

export default Todo;
