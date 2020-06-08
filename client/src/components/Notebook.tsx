import React, { CSSProperties } from 'react';
import Sheet from './Sheet';
import CreateSheetButton from './CreateSheetButton';

const ul: CSSProperties = {
  padding: '0',
};

interface Props {
  id: number;
  sheets: [];
}

function Notebook(props: Props) {
  return (
    <div>
      <CreateSheetButton title="Title" notebookId={props.id} />
      <ul style={ul}>
        {props.sheets.map((sheet: any) => (
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
