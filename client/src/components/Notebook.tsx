import React from 'react';
import Sheet from './Sheet';
import CreateSheetButton from './CreateSheetButton';
import Button from './Button';
import '../assets/css/notebook.css';

interface Props {
  id: number;
  sheets: [];
}

function Notebook(props: Props) {
  return (
    <div>
      <div className="notebook-header">
        <CreateSheetButton title="Title" notebookId={props.id} />
        <div className="notebook-listorganizers-container">
          <Button type="button" styleType="icon" icon="filter_list" />
          <Button type="button" styleType="icon" icon="sort" />
        </div>
      </div>
      <ul className="notebook-ul">
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
