import React, { CSSProperties, useState } from 'react';
import gql from 'graphql-tag';
import TodoCheckbox from './TodoCheckbox';
import TodoText from './TodoText';
import DeleteTodoButton from './DeleteTodoButton';

const li: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  width: '560px',
  height: '64px',
};

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
      style={li}
      onFocus={() => setIsShowingDeleteTodoButton(true)}
      onBlur={() => setIsShowingDeleteTodoButton(false)}
    >
      <TodoCheckbox
        todoId={props.id}
        isChecked={props.isChecked}
        sheetId={props.sheetId}
      />
      <TodoText todoId={props.id} text={props.text} sheetId={props.sheetId} />
      {isShowingDeleteTodoButton && (
        <DeleteTodoButton todoId={props.id} sheetId={props.sheetId} />
      )}
    </li>
  );
}

export default Todo;
