import React from 'react';
import gql from 'graphql-tag';
import EditableTextArea from './EditableTextArea';
import { useMutation } from '@apollo/react-hooks';

const UPDATE_INSTRUCTION = gql`
  mutation UpdateInstruction(
    $instructionId: ID!
    $step: String
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
        text
      }
    }
  }
`;

interface Props {
  instructionId: number;
  recipeId: number;
  text: string;
}

function InstructionText(props: Props) {
  const [updateInstruction] = useMutation(UPDATE_INSTRUCTION);

  const onSubmit = (text: string) => {
    updateInstruction({
      variables: {
        instructionId: props.instructionId,
        text,
        recipeId: props.recipeId,
      },
    });
  };

  return (
    <EditableTextArea semanticalType="p" onSubmit={onSubmit}>
      {props.text}
    </EditableTextArea>
  );
}

export default InstructionText;
