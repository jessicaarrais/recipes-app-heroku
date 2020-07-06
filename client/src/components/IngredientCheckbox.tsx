import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import '../assets/css/ingredient.css';

const UPDATE_INGREDIENT = gql`
  mutation UpdateIngredient(
    $ingredientId: ID!
    $text: String
    $isChecked: Boolean
    $recipeId: ID!
  ) {
    updateIngredient(
      ingredientId: $ingredientId
      text: $text
      isChecked: $isChecked
      recipeId: $recipeId
    ) {
      ingredient {
        id
        recipeId
        text
        isChecked
      }
    }
  }
`;

interface Props {
  ingredientId: number;
  isChecked: boolean;
  recipeId: number;
}

function IngredientCheckbox(props: Props) {
  const [updateIngredient, { error }] = useMutation(UPDATE_INGREDIENT);

  const handleUpdateIngredientCheckbox = (isChecked: boolean): void => {
    if (isChecked !== props.isChecked) {
      updateIngredient({
        variables: {
          ingredientId: props.ingredientId,
          isChecked,
          recipeId: props.recipeId,
        },
      });
    }
  };

  if (error) return <h1>An error has occurred. ${error.message}</h1>;

  return (
    <input
      className="todo-checkbox"
      type="checkbox"
      checked={props.isChecked}
      onChange={(e) => {
        handleUpdateIngredientCheckbox(e.target.checked);
      }}
    />
  );
}

export default IngredientCheckbox;
