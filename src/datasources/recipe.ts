import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { dbRecipe, RecipeModel } from '../store';
import { Context } from '..';
import { Op, OrderItem, Sequelize } from 'sequelize';

interface CreateRecipeParams {
  title: string;
  description: string;
}

interface UpdateRecipeParams {
  title?: string;
  description?: string;
  isPublic?: boolean;
}

export enum RecipesListOrder {
  DEFAULT = 'DEFAULT',
  TITLE_ASCENDING = 'TITLE_ASCENDING',
}

class Recipe extends DataSource {
  context!: Context;

  initialize(config: DataSourceConfig<Context>): void | Promise<void> {
    this.context = config.context;
  }

  async searchRecipes(value: string): Promise<Array<RecipeModel>> {
    return await dbRecipe.findAll({
      where: { title: { [Op.iLike]: `%${value}%` }, isPublic: true },
    });
  }

  async getRecipe(id: string): Promise<RecipeModel | null> {
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
        ? [Sequelize.fn('lower', Sequelize.col('title')), 'ASC']
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

  async createRecipe({
    title,
    description,
  }: CreateRecipeParams): Promise<RecipeModel | null> {
    if (!this.context.user) return null;
    return await dbRecipe.create({
      title,
      description,
      ownerId: this.context.user.id,
      cookbookId: this.context.user.cookbookId,
    });
  }

  async updateRecipe(
    updatedRecipe: UpdateRecipeParams,
    recipeId: string
  ): Promise<RecipeModel | null> {
    if (!this.context.user) return null;
    const recipe = await dbRecipe.findOne({ where: { id: recipeId } });
    if (!recipe) return null;
    if (recipe.ownerId !== this.context.user.id) return null;
    return await recipe.update(updatedRecipe);
  }

  async likeRecipe(recipeId: string): Promise<RecipeModel | null> {
    if (!this.context.user) return null;
    const recipe = await dbRecipe.findOne({ where: { id: recipeId } });
    if (!recipe) return null;
    await recipe.update({
      likes: Sequelize.fn('array_append', Sequelize.col('likes'), this.context.user.id),
    });
    return await recipe.reload();
  }

  async unlikeRecipe(recipeId: string): Promise<RecipeModel | null> {
    if (!this.context.user) return null;
    const recipe = await dbRecipe.findOne({ where: { id: recipeId } });
    if (!recipe) return null;
    await recipe.update({
      likes: Sequelize.fn('array_remove', Sequelize.col('likes'), this.context.user.id),
    });
    return await recipe.reload();
  }

  async deleteRecipe(recipeId: string): Promise<boolean> {
    if (!this.context.user) return false;
    const recipe = await dbRecipe.findOne({ where: { id: recipeId } });
    if (!recipe) return false;
    if (recipe.ownerId !== this.context.user.id) return false;
    return (
      (await dbRecipe.destroy({
        where: { id: recipeId },
      })) === 1
    );
  }
}

export default Recipe;
