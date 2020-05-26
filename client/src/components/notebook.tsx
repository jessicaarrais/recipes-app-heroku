import React from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Sheet, { SHEET_FRAGMENT } from './sheet';
import Button from './button';

const NOTEBOOK_FRAGMENT = gql`
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

const CREATE_SHEET = gql`
  mutation CreateSheet($title: String, $notebookId: ID!) {
    createSheet(title: $title, notebookId: $notebookId) {
      notebook {
        ...NotebookFragment
      }
    }
  }
  ${NOTEBOOK_FRAGMENT}
`;

function Notebook() {
  const { data, loading, error } = useQuery(GET_NOTEBOOK);
  const [createSheet] = useMutation(CREATE_SHEET);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>An error has ocurred</h1>;

  return (
    <div>
      <Button
        type="button"
        handleOnClick={() =>
          createSheet({
            variables: { title: 'Title', notebookId: data.user.notebook.id },
          })
        }
      >
        New Sheet
      </Button>

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
