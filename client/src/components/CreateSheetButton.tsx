import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Button from './Button';
import { SHEET_FRAGMENT } from './Sheet';
import Icon from './Icon';

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
      actionType="primary"
      handleOnClick={() =>
        createSheet({
          variables: { title: props.title, notebookId: props.notebookId },
        })
      }
    >
      <Icon icon="create" />
      New Sheet
    </Button>
  );
}

export default CreateSheetButton;
