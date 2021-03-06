import { Context } from '..';
import { CookbookModel } from '../store';
import RecipeGQL from './recipeGQL';
import { RecipesListOrder } from '../datasources/recipe';

class CookbookGQL {
  id: string;

  constructor(cookbookModel: CookbookModel) {
    this.id = cookbookModel.id;
  }

  async recipes(
    args: { order: RecipesListOrder },
    context: Context
  ): Promise<Array<RecipeGQL>> {
    return (await context.dataSources.recipeAPI.getRecipes(this.id, args.order)).map(
      (recipeModel) => new RecipeGQL(recipeModel)
    );
  }
}

export default CookbookGQL;
