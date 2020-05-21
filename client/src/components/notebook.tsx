import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Sheet from './sheet';

const GET_NOTEBOOK = gql`
  query User {
    user {
      notebook {
        id
        sheets {
          id
          notebookId
          title
          todos {
            id
            sheetId
            text
            isChecked
          }
        }
      }
    }
  }
`;

function Notebook() {
  const { data, loading, error } = useQuery(GET_NOTEBOOK);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>An error has ocurred</h1>;

  return (
    <div>
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
