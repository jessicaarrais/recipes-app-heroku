import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { dbIngredient, IngredientModel, db } from '../store';
import { Context } from '..';

interface NewIngredient {
  text: string;
  isChecked: boolean;
  recipeId: number;
}

interface UpdatedIngredient {
  text: string;
  isChecked: boolean;
}

class Ingredient extends DataSource {
  context: Context;

  initialize(config: DataSourceConfig<Context>): void | Promise<void> {
    this.context = config.context;
  }

  async getIngredients(recipeId: number): Promise<Array<IngredientModel>> {
    return await dbIngredient.findAll({
      where: { recipeId },
    });
  }

  async createIngredient({
    text,
    isChecked,
    recipeId,
  }: NewIngredient): Promise<IngredientModel> {
    return await dbIngredient.create({ text, isChecked, recipeId });
  }

  async updateIngredient(
    updatedIngredient: UpdatedIngredient,
    ingredientId: number
  ): Promise<IngredientModel> {
    const ingredient = await dbIngredient.findOne({ where: { id: ingredientId } });
    if (!ingredient) {
      return null;
    }
    return await ingredient.update(updatedIngredient);
  }

  async deleteIngredient(ingredientId: number): Promise<boolean> {
    return (await dbIngredient.destroy({ where: { id: ingredientId } })) === 1;
  }
}

export default Ingredient;
