import React from 'react';
import Recipe from './Recipe';
import CreateRecipeButton from './CreateRecipeButton';
import Button from './Button';
import Icon from './Icon';
import '../assets/css/cookbook.css';

interface Props {
  id: number;
  recipes: [];
}

function Cookbook(props: Props) {
  return (
    <div>
      <div className="notebook-header">
        <div className="create-sheet-container">
          <CreateRecipeButton cookbookId={props.id} />
        </div>
        <div className="notebook-list-organizers-container">
          <div className="filter-list-container">
            <Button type="button" actionType="default">
              <Icon icon="filter_list" />
            </Button>
          </div>
          <div className="sort-list-container">
            <Button type="button" actionType="default">
              <Icon icon="sort" />
            </Button>
          </div>
        </div>
      </div>
      <ul className="notebook-ul">
        {props.recipes.map((recipe: any) => (
          <Recipe
            key={recipe.id}
            id={recipe.id}
            cookbookId={recipe.cookbookId}
            title={recipe.title}
            ingredients={recipe.ingredients}
            instructions={recipe.instructions}
          />
        ))}
      </ul>
    </div>
  );
}
export default Cookbook;
