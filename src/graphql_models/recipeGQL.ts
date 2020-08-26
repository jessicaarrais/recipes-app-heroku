import { RecipeModel } from '../store';
import { Context } from '..';
import IngredientGQL from './ingredientGQL';
import InstructionGQl from './instructionGQL';

class RecipeGQL {
  id: number;
  cookbookId: number;
  title: string;
  isPublic: boolean;

  constructor(recipeModel: RecipeModel) {
    this.id = recipeModel.id;
    this.cookbookId = recipeModel.cookbookId;
    this.title = recipeModel.title;
    this.isPublic = recipeModel.isPublic;
  }

  async ingredients(_args, context: Context): Promise<Array<IngredientGQL>> {
    return (await context.dataSources.ingredientAPI.getIngredients(this.id)).map(
      (ingredientModel) => new IngredientGQL(ingredientModel)
    );
  }

  async instructions(_args, context: Context): Promise<Array<InstructionGQl>> {
    return (await context.dataSources.instructionAPI.getInstructions(this.id)).map(
      (instructionModel) => new InstructionGQl(instructionModel)
    );
  }
}

export default RecipeGQL;
