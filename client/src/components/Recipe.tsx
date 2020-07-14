import React from 'react';
import gql from 'graphql-tag';
import Ingredient, { INGREDIENT_FRAGMENT } from './Ingredient';
import CreateIngredientButton from './CreateIngredientButton';
import DeleteRecipeButton from './DeleteRecipeButton';
import RecipeTitle from './RecipeTitle';
import '../assets/css/recipe.css';
import Button from './Button';
import Icon from './Icon';
import Instruction from './Instruction';
import CreateInstructionButton from './CreateInstructionButton';

export const RECIPE_FRAGMENT = gql`
  fragment RecipeFragment on Recipe {
    __typename
    id
    cookbookId
    title
    ingredients {
      ...IngredientFragment
    }
    instructions {
      id
      recipeId
      step
      text
    }
  }
  ${INGREDIENT_FRAGMENT}
`;

interface Props {
  id: number;
  cookbookId: number;
  title: string;
  ingredients: [];
  instructions?: [];
}

function Recipe(props: Props) {
  return (
    <li className="sheet-li">
      <div className="sheet-header">
        <RecipeTitle id={props.id} cookbookId={props.cookbookId} title={props.title} />
        <div>
          <Button type="button" actionType="secondary">
            <Icon icon="favorite_border" />
          </Button>
        </div>
      </div>
      <ul>
        {props.ingredients.map((ingredient: any) => (
          <Ingredient
            key={ingredient.id}
            id={ingredient.id}
            recipeId={ingredient.recipeId}
            isChecked={ingredient.isChecked}
            text={ingredient.text}
          />
        ))}
      </ul>
      {props.instructions && (
        <ul>
          {props.instructions.map((instruction: any) => (
            <Instruction
              key={instruction.id}
              id={instruction.id}
              recipeId={instruction.recipeId}
              step={instruction.step}
              text={instruction.text}
            />
          ))}
        </ul>
      )}
      <div className="sheet-btns-container">
        <div className="create-todo-container">
          <CreateIngredientButton
            text="ingredient"
            isChecked={false}
            recipeId={props.id}
          />
        </div>
        <div className="create-instruction-container">
          <CreateInstructionButton
            step="Step:"
            text={'Instruction'}
            recipeId={props.id}
          />
        </div>
        <div className="delete-sheet-container">
          <DeleteRecipeButton recipeId={props.id} cookbookId={props.cookbookId} />
        </div>
      </div>
    </li>
  );
}

export default Recipe;
