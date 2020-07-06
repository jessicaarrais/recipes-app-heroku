import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Button from './Button';
import { RECIPE_FRAGMENT } from './Recipe';
import Icon from './Icon';

const CREATE_RECIPE = gql`
  mutation CreateRecipe($title: String, $cookbookId: ID!) {
    createRecipe(title: $title, cookbookId: $cookbookId) {
      cookbook {
        id
        recipes {
          ...RecipeFragment
        }
      }
    }
  }
  ${RECIPE_FRAGMENT}
`;

interface Props {
  title: string;
  cookbookId: number;
}

function CreateRecipeButton(props: Props) {
  const [createRecipe, { error }] = useMutation(CREATE_RECIPE);

  if (error) return <h1>An error has occurred. ${error.message}</h1>;

  return (
    <Button
      type="button"
      actionType="primary"
      handleOnClick={() =>
        createRecipe({
          variables: { title: props.title, cookbookId: props.cookbookId },
        })
      }
    >
      <Icon icon="create" />
      New Sheet
    </Button>
  );
}

export default CreateRecipeButton;
