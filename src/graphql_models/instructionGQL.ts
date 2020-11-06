import { Context } from '..';
import IngredientGQL from './ingredientGQL';
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

  async ingredients(_args: {}, context: Context): Promise<Array<IngredientGQL>> {
    return (await context.dataSources.ingredientAPI.getIngredients(this.id)).map(
      (ingredientModel) => new IngredientGQL(ingredientModel)
    );
  }
}

export default InstructionGQL;
