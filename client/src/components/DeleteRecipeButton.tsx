import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
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
      delete sheet
    </Button>
  );
}

export default DeleteRecipeButton;
