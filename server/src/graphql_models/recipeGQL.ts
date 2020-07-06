import { RecipeModel } from '../store';
import { Context } from '..';
import IngredientGQL from './ingredientGQL';

class RecipeGQL {
  id: number;
  cookbookId: number;
  title: string;

  constructor(recipeModel: RecipeModel) {
    this.id = recipeModel.id;
    this.cookbookId = recipeModel.cookbookId;
    this.title = recipeModel.title;
  }

  async ingredients(_args, context: Context): Promise<Array<IngredientGQL>> {
    return (await context.dataSources.ingredientAPI.getIngredients(this.id)).map(
      (ingredientModel) => new IngredientGQL(ingredientModel)
    );
  }
}

export default RecipeGQL;
