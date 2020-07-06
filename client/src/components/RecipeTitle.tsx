import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import EditableTextArea from './EditableTextArea';

const UPDATE_RECIPE = gql`
  mutation UpdateRecipe($recipeId: ID!, $title: String, $cookbookId: ID!) {
    updateRecipe(recipeId: $recipeId, title: $title, cookbookId: $cookbookId) {
      recipe {
        id
        title
      }
    }
  }
`;

interface Props {
  id: number;
  cookbookId: number;
  title: string;
}

function RecipeTitle(props: Props) {
  const [updateRecipe, { error }] = useMutation(UPDATE_RECIPE);

  const onSubmit = (title: string) =>
    updateRecipe({
      variables: { recipeId: props.id, title, cookbookId: props.cookbookId },
    });

  if (error) return <h1>An error has occurred. ${error.message}</h1>;

  return (
    <div className="sheet-title-container">
      <EditableTextArea semanticalType="h2" onSubmit={onSubmit}>
        {props.title}
      </EditableTextArea>
    </div>
  );
}

export default RecipeTitle;
