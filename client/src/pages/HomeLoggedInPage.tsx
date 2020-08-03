import React from 'react';
import Cookbook from '../components/Cookbook';

interface Props {
  cookbookId: number;
  recipes: [];
}

function Home(props: Props) {
  return (
    <div>
      <Cookbook id={props.cookbookId} recipes={props.recipes} />
    </div>
  );
}

export default Home;
