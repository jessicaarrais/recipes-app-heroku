import React, { CSSProperties } from 'react';
import gql from 'graphql-tag';
import TodoCheckbox from './TodoCheckbox';
import TodoText from './TodoText';

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
  return (
    <li style={li}>
      <TodoCheckbox
        todoId={props.id}
        isChecked={props.isChecked}
        sheetId={props.sheetId}
      />
      <TodoText todoId={props.id} text={props.text} sheetId={props.sheetId} />
    </li>
  );
}

export default Todo;
