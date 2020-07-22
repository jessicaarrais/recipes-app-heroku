import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Button from './Button';
import Icon from './Icon';

const CREATE_INSTRUCTION = gql`
  mutation CreateInstruction($step: String, $text: String, $recipeId: ID!) {
    createInstruction(step: $step, text: $text, recipeId: $recipeId) {
      recipe {
        id
        instructions {
          id
          recipeId
          step
          text
        }
      }
    }
  }
`;

interface Props {
  recipeId: number;
}

function CreateInstructionButton(props: Props) {
  const [createInstruction] = useMutation(CREATE_INSTRUCTION);

  return (
    <Button
      type="button"
      actionType="primary"
      handleOnClick={() =>
        createInstruction({
          variables: { recipeId: props.recipeId, step: 'Step: ', text: 'Instruction' },
        })
      }
    >
      <Icon icon="add" />
      add instruction
    </Button>
  );
}

export default CreateInstructionButton;
