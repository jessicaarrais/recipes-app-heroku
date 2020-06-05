import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { TODO_FRAGMENT } from './Todo';
import Button from './Button';

const CREATE_TODO = gql`
  mutation CreateTodo($text: String, $isChecked: Boolean, $sheetId: ID!) {
    createTodo(text: $text, isChecked: $isChecked, sheetId: $sheetId) {
      success
      message
      sheet {
        id
        title
        todos {
          ...TodoFragment
        }
      }
    }
  }
  ${TODO_FRAGMENT}
`;

interface Props {
  text: string;
  isChecked: boolean;
  sheetId: number;
}

function CreateTodoButton(props: Props) {
  const [createTodo] = useMutation(CREATE_TODO);

  return (
    <Button
      type="button"
      styleType="primary"
      icon="add"
      handleOnClick={() => createTodo({ variables: props })}
      handleOnKeyDown={(e) => {
        if (e.key === 'Enter') createTodo({ variables: props });
      }}
    >
      new todo
    </Button>
  );
}

export default CreateTodoButton;
