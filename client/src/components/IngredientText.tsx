import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import EditableTextArea from './EditableTextArea';

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
  text: string;
  recipeId: number;
}

function IngredientText(props: Props) {
  const [updateIngredient, { error }] = useMutation(UPDATE_INGREDIENT);

  const onSubmit = (text: string): void => {
    updateIngredient({
      variables: { ingredientId: props.ingredientId, text, recipeId: props.recipeId },
    });
  };

  if (error) return <h1>An error has occurred. ${error.message}</h1>;

  return (
    <EditableTextArea semanticalType="p" onSubmit={onSubmit}>
      {props.text}
    </EditableTextArea>
  );
}

export default IngredientText;
