import React from 'react';
import { gql, useMutation } from '@apollo/client';
import Button from './Button';
import Icon from './Icon';

const DELETE_INSTRUCTION = gql`
  mutation DeleteInstruction($instructionId: ID!, $recipeId: ID!) {
    deleteInstruction(instructionId: $instructionId, recipeId: $recipeId) {
      recipe {
        id
        instructions {
          id
        }
      }
    }
  }
`;

interface Props {
  instructionId: number;
  recipeId: number;
}

function DeleteInstructionButton(props: Props) {
  const [deleteInstruction, { error }] = useMutation(DELETE_INSTRUCTION);

  if (error) return <h1>An error has occurred. ${error.message}</h1>;

  return (
    <Button
      type="button"
      actionType="danger"
      handleOnClick={() => deleteInstruction({ variables: props })}
    >
      <Icon icon="clear" />
    </Button>
  );
}

export default DeleteInstructionButton;
