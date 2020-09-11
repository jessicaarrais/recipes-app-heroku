import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { dbRecipe, RecipeModel } from '../store';
import { Context } from '..';
import { Op, OrderItem } from 'sequelize';

interface UpdateRecipeParams {
  title: string;
  isPublic: boolean;
}

export enum RecipesListOrder {
  DEFAULT = 'DEFAULT',
  TITLE_ASCENDING = 'TITLE_ASCENDING',
}

class Recipe extends DataSource {
  context: Context;

  initialize(config: DataSourceConfig<Context>): void | Promise<void> {
    this.context = config.context;
  }

  async searchRecipes(value: string): Promise<Array<RecipeModel>> {
    return await dbRecipe.findAll({
      where: { title: { [Op.iLike]: `%${value}%` }, isPublic: true },
    });
  }

  async getRecipe(id: string): Promise<RecipeModel> {
    const recipe = await dbRecipe.findOne({ where: { id } });
    if (!recipe) return null;
    const isOwner = this.context.user?.id === recipe.ownerId;
    return isOwner || recipe.isPublic ? recipe : null;
  }

  async getRecipes(
    cookbookId: string,
    order?: RecipesListOrder
  ): Promise<Array<RecipeModel>> {
    const listOrderer: OrderItem =
      order === RecipesListOrder.TITLE_ASCENDING
        ? ['title', 'ASC']
        : ['createdAt', 'DESC'];

    if (this.context.user?.cookbookId != cookbookId) {
      return await dbRecipe.findAll({
        where: { cookbookId, isPublic: true },
        order: [listOrderer],
      });
    }
    return await dbRecipe.findAll({
      where: { cookbookId },
      order: [listOrderer],
    });
  }

  async createRecipe(): Promise<RecipeModel> {
    return await dbRecipe.create({
      title: 'Title',
      ownerId: this.context.user.id,
      cookbookId: this.context.user.cookbookId,
    });
  }

  async updateRecipe(
    updatedRecipe: UpdateRecipeParams,
    recipeId: string
  ): Promise<RecipeModel> {
    const recipe = await dbRecipe.findOne({ where: { id: recipeId } });
    if (!recipe) {
      return null;
    }
    return await recipe.update(updatedRecipe);
  }

  async deleteRecipe(recipeId: string): Promise<boolean> {
    return (await dbRecipe.destroy({ where: { id: recipeId } })) === 1;
  }
}

export default Recipe;
