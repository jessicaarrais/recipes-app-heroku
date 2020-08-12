import { Context } from '..';
import { CookbookModel } from '../store';
import RecipeGQL from './recipeGQL';

class CookbookGQL {
  id: number;

  constructor(cookbookModel: CookbookModel) {
    this.id = cookbookModel.id;
  }

  async recipes(_args, context: Context): Promise<Array<RecipeGQL>> {
    return (await context.dataSources.recipeAPI.getRecipes(this.id)).map(
      (recipeModel) => new RecipeGQL(recipeModel)
    );
  }
}

export default CookbookGQL;
