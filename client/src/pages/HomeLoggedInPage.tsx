import React from 'react';
import Cookbook from '../components/Cookbook';

interface Props {
  cookbookId: number;
  recipes: [];
}

function HomeLoggedInPage(props: Props) {
  return (
    <div>
      <Cookbook id={props.cookbookId} recipes={props.recipes} />
    </div>
  );
}

export default HomeLoggedInPage;
