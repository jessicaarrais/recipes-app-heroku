import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { dbIngredient, dbRecipe, IngredientModel } from '../store';
import { Context } from '..';

interface CreateIngredientParams {
  text: string;
  isChecked: boolean;
  recipeId: string;
}

interface UpdateIngredientParams {
  text: string;
  isChecked: boolean;
}

class Ingredient extends DataSource {
  context!: Context;

  initialize(config: DataSourceConfig<Context>): void | Promise<void> {
    this.context = config.context;
  }

  async getIngredients(recipeId: string): Promise<Array<IngredientModel>> {
    return await dbIngredient.findAll({ where: { recipeId } });
  }

  async createIngredient({
    text,
    isChecked,
    recipeId,
  }: CreateIngredientParams): Promise<IngredientModel | null> {
    if (!(await this.isOwner(recipeId))) return null;
    return await dbIngredient.create({ text, isChecked, recipeId });
  }

  async updateIngredient(
    updatedIngredient: UpdateIngredientParams,
    ingredientId: string,
    recipeId: string
  ): Promise<IngredientModel | null> {
    if (!(await this.isOwner(recipeId))) return null;
    const ingredient = await dbIngredient.findOne({
      where: { id: ingredientId, recipeId },
    });
    if (!ingredient) return null;
    return await ingredient.update(updatedIngredient);
  }

  async deleteIngredient(ingredientId: string, recipeId: string): Promise<boolean> {
    if (!(await this.isOwner(recipeId))) return false;
    return (await dbIngredient.destroy({ where: { id: ingredientId } })) === 1;
  }

  async isOwner(recipeId: string): Promise<boolean> {
    if (!this.context.user) return false;
    const recipe = await dbRecipe.findOne({ where: { id: recipeId } });
    if (!recipe) return false;
    return recipe.ownerId === this.context.user.id;
  }
}

export default Ingredient;
