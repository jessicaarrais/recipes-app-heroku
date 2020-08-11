import React from 'react';
import { gql, useMutation } from '@apollo/client';
import Button from './Button';
import Icon from './Icon';

const DELETE_RECIPE = gql`
  mutation DeleteRecipe($recipeId: ID!, $cookbookId: ID!) {
    deleteRecipe(recipeId: $recipeId, cookbookId: $cookbookId) {
      cookbook {
        id
        recipes {
          id
        }
      }
    }
  }
`;

interface Props {
  recipeId: number;
  cookbookId: number;
}

function DeleteRecipeButton(props: Props) {
  const [deleteRecipe] = useMutation(DELETE_RECIPE);

  return (
    <Button
      type="button"
      actionType="danger"
      handleOnClick={() => deleteRecipe({ variables: props })}
    >
      <Icon icon="delete" />
      delete recipe
    </Button>
  );
}

export default DeleteRecipeButton;
