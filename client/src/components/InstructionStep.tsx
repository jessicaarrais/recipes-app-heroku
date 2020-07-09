import React from 'react';
import gql from 'graphql-tag';
import EditableTextArea from './EditableTextArea';
import { useMutation } from '@apollo/react-hooks';

const UPDATE_INSTRUCTION = gql`
  mutation UpdateInstruction(
    $instructionId: ID!
    $step: Int
    $text: String
    $recipeId: ID!
  ) {
    updateInstruction(
      instructionId: $instructionId
      step: $step
      text: $text
      recipeId: $recipeId
    ) {
      instruction {
        id
        step
      }
    }
  }
`;

interface Props {
  instructionId: number;
  recipeId: number;
  step: number;
}

function InstructionStep(props: Props) {
  const [updateInstruction] = useMutation(UPDATE_INSTRUCTION);

  const validate = (step: string): number => {
    const stepToInt = parseInt(step, 10);
    if (isNaN(stepToInt)) {
      throw new Error('Step must be a number');
    }
    return stepToInt;
  };

  const onSubmit = (step: string): void => {
    const validatedStep = validate(step);
    if (validatedStep) {
      updateInstruction({
        variables: {
          instructionId: props.instructionId,
          step: parseInt(step, 10),
          recipeId: props.recipeId,
        },
      });
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <label>Step</label>
      <EditableTextArea semanticalType="p" onSubmit={onSubmit}>
        {props.step.toString()}
      </EditableTextArea>
    </div>
  );
}

export default InstructionStep;
