import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { dbRecipe, RecipeModel } from '../store';
import { Context } from '..';

interface NewRecipe {
  title: string;
  cookbookId: number;
}

interface UpdatedRecipe {
  title: string;
}

class Recipe extends DataSource {
  context: Context;

  initialize(config: DataSourceConfig<Context>): void | Promise<void> {
    this.context = config.context;
  }

  async getRecipe(recipeId: number): Promise<RecipeModel> {
    return await dbRecipe.findOne({ where: { id: recipeId } });
  }

  async getRecipes(cookbookId: number): Promise<Array<RecipeModel>> {
    return await dbRecipe.findAll({
      where: { cookbookId },
    });
  }

  async createRecipe({ title, cookbookId }: NewRecipe): Promise<RecipeModel> {
    return await dbRecipe.create({
      title,
      cookbookId,
    });
  }

  async updateRecipe(
    updatedRecipe: UpdatedRecipe,
    recipeId: number
  ): Promise<RecipeModel> {
    const recipe = await dbRecipe.findOne({ where: { id: recipeId } });
    if (!recipe) {
      return null;
    }
    return await recipe.update(updatedRecipe);
  }

  async deleteRecipe(recipeId: number): Promise<boolean> {
    return (await dbRecipe.destroy({ where: { id: recipeId } })) === 1;
  }
}

export default Recipe;
