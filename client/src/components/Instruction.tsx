import React, { useState } from 'react';
import InstructionStep from './InstructionStep';
import InstructionText from './InstructionText';
import DeleteInstructionButton from './DeleteInstructionButton';
import '../assets/css/instruction.css';

interface Props {
  id: number;
  recipeId: number;
  step: number;
  text: string;
}

function Instruction(props: Props) {
  const [
    isShowingDeleteInstructionButton,
    setIsShowingDeleteInstructionButton,
  ] = useState(false);

  return (
    <li
      style={{ marginBottom: '32px' }}
      className="instruction-li"
      onMouseOver={() => setIsShowingDeleteInstructionButton(true)}
      onMouseLeave={() => setIsShowingDeleteInstructionButton(false)}
    >
      <InstructionStep
        instructionId={props.id}
        recipeId={props.recipeId}
        step={props.step}
      />
      <InstructionText
        instructionId={props.id}
        recipeId={props.recipeId}
        text={props.text}
      />
      {isShowingDeleteInstructionButton && (
        <div>
          <DeleteInstructionButton instructionId={props.id} recipeId={props.recipeId} />
        </div>
      )}
    </li>
  );
}

export default Instruction;
