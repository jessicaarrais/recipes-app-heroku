import React from 'react';
import Notebook from '../components/Notebook';

interface Props {
  notebookId: number;
  sheets: [];
}

function Home(props: Props) {
  return (
    <div>
      <Notebook id={props.notebookId} sheets={props.sheets} />
    </div>
  );
}

export default Home;
