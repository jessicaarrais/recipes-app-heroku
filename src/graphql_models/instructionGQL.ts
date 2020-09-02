import { InstructionModel } from '../store';

class InstructionGQl {
  id: string;
  recipeId: string;
  step: string;
  text: string;

  constructor(instructionModel: InstructionModel) {
    this.id = instructionModel.id;
    this.recipeId = instructionModel.recipeId;
    this.step = instructionModel.step;
    this.text = instructionModel.text;
  }
}

export default InstructionGQl;
