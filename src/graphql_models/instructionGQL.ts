import { InstructionModel } from '../store';

class InstructionGQL {
  id: string;
  recipeId: string;
  step: string;
  description: string;
  tip: string;

  constructor(instructionModel: InstructionModel) {
    this.id = instructionModel.id;
    this.recipeId = instructionModel.recipeId;
    this.step = instructionModel.step;
    this.description = instructionModel.description;
    this.tip = instructionModel.tip;
  }
}

export default InstructionGQL;
