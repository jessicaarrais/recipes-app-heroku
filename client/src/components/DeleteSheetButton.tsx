import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Button from './Button';

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

interface Props {
  sheetId: number;
  notebookId: number;
}

function DeleteSheetButton(props: Props) {
  const [deleteSheet] = useMutation(DELETE_SHEET);

  return (
    <Button
      type="button"
      styleType="danger"
      icon="delete"
      handleOnClick={() => deleteSheet({ variables: props })}
      handleOnKeyDown={(e) => {
        if (e.key === 'Enter') deleteSheet({ variables: props });
      }}
    >
      delete sheet
    </Button>
  );
}

export default DeleteSheetButton;
