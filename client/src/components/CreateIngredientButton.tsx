import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { INGREDIENT_FRAGMENT } from './Ingredient';
import Button from './Button';
import Icon from './Icon';

const CREATE_INGREDIENT = gql`
  mutation CreateIngredient($text: String, $isChecked: Boolean, $recipeId: ID!) {
    createIngredient(text: $text, isChecked: $isChecked, recipeId: $recipeId) {
      success
      message
      recipe {
        id
        title
        ingredients {
          ...IngredientFragment
        }
      }
    }
  }
  ${INGREDIENT_FRAGMENT}
`;

interface Props {
  text: string;
  isChecked: boolean;
  recipeId: number;
}

function CreateIngredientButton(props: Props) {
  const [createIngredient] = useMutation(CREATE_INGREDIENT);

  return (
    <Button
      type="button"
      actionType="primary"
      handleOnClick={() => createIngredient({ variables: props })}
    >
      <Icon icon="add" />
      new todo
    </Button>
  );
}

export default CreateIngredientButton;
