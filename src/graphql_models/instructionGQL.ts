import { InstructionModel } from '../store';

class InstructionGQL {
  id: string;
  recipeId: string;
  step: string;
  description: string;

  constructor(instructionModel: InstructionModel) {
    this.id = instructionModel.id;
    this.recipeId = instructionModel.recipeId;
    this.step = instructionModel.step;
    this.description = instructionModel.description;
  }
}

export default InstructionGQL;
