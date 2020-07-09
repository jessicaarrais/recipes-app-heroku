import { InstructionModel } from '../store';

class InstructionGQl {
  id: number;
  recipeId: number;
  step: number;
  text: string;

  constructor(instructionModel: InstructionModel) {
    this.id = instructionModel.id;
    this.recipeId = instructionModel.recipeId;
    this.step = instructionModel.step;
    this.text = instructionModel.text;
  }
}

export default InstructionGQl;
