import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import EditableTextArea from './EditableTextArea';

const UPDATE_SHEET = gql`
  mutation UpdateSheet($sheetId: ID!, $title: String, $notebookId: ID!) {
    updateSheet(sheetId: $sheetId, title: $title, notebookId: $notebookId) {
      sheet {
        id
        title
      }
    }
  }
`;

interface Props {
  id: number;
  notebookId: number;
  title: string;
}

function SheetTitle(props: Props) {
  const [updateSheet, { error }] = useMutation(UPDATE_SHEET);

  const onSubmit = (title: string) =>
    updateSheet({
      variables: { sheetId: props.id, title, notebookId: props.notebookId },
    });

  if (error) return <h1>An error has occurred. ${error.message}</h1>;

  return (
    <div className="sheet-title-container">
      <EditableTextArea semanticalType="h2" onSubmit={onSubmit}>
        {props.title}
      </EditableTextArea>
    </div>
  );
}

export default SheetTitle;
