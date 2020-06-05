import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Button from './Button';
import { SHEET_FRAGMENT } from './Sheet';

const CREATE_SHEET = gql`
  mutation CreateSheet($title: String, $notebookId: ID!) {
    createSheet(title: $title, notebookId: $notebookId) {
      notebook {
        id
        sheets {
          ...SheetFragment
        }
      }
    }
  }
  ${SHEET_FRAGMENT}
`;

interface Props {
  title: string;
  notebookId: number;
}

function CreateSheetButton(props: Props) {
  const [createSheet, { error }] = useMutation(CREATE_SHEET);

  if (error) return <h1>An error has occurred. ${error.message}</h1>;

  return (
    <Button
      type="button"
      styleType="primary"
      icon="create"
      handleOnClick={() =>
        createSheet({
          variables: { title: props.title, notebookId: props.notebookId },
        })
      }
      handleOnKeyDown={(e) => {
        if (e.key === 'Enter') {
          createSheet({
            variables: {
              title: props.title,
              notebookId: props.notebookId,
            },
          });
        }
      }}
    >
      New Sheet
    </Button>
  );
}

export default CreateSheetButton;
