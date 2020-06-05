import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

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
  const [newTitle, setNewTitle] = useState(props.title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleUpdateSheetTitle = (title: string): void => {
    setIsEditingTitle(false);
    if (title !== props.title) {
      updateSheet({
        variables: { sheetId: props.id, title, notebookId: props.notebookId },
      });
    }
  };

  if (error) return <h1>An error has occurred. ${error.message}</h1>;

  return (
    <div>
      {isEditingTitle ? (
        <input
          ref={(ref) => {
            ref && ref.focus();
          }}
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleUpdateSheetTitle(newTitle);
          }}
          onBlur={() => handleUpdateSheetTitle(newTitle)}
        />
      ) : (
        <h2
          tabIndex={0}
          onClick={() => {
            setIsEditingTitle(true);
            setNewTitle(props.title);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setIsEditingTitle(true);
              setNewTitle(props.title);
            }
          }}
        >
          {props.title}
        </h2>
      )}
    </div>
  );
}

export default SheetTitle;
