import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Sheet, { SHEET_FRAGMENT } from './Sheet';
import CreateSheetButton from './CreateSheetButton';

export const NOTEBOOK_FRAGMENT = gql`
  fragment NotebookFragment on Notebook {
    __typename
    id
    sheets {
      ...SheetFragment
    }
  }
  ${SHEET_FRAGMENT}
`;

const GET_NOTEBOOK = gql`
  query User {
    user {
      notebook {
        ...NotebookFragment
      }
    }
  }
  ${NOTEBOOK_FRAGMENT}
`;

function Notebook() {
  const { data, loading, error } = useQuery(GET_NOTEBOOK);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>An error has occurred. ${error.message}</h1>;

  return (
    <div>
      <CreateSheetButton title={'Title'} notebookId={data.user.notebook.id} />
      <ul>
        {data?.user.notebook.sheets.map((sheet: any) => (
          <Sheet
            key={sheet.id}
            id={sheet.id}
            notebookId={sheet.notebookId}
            title={sheet.title}
            todos={sheet.todos}
          />
        ))}
      </ul>
    </div>
  );
}
export default Notebook;
