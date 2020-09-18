import { RecipeModel } from '../store';
import { Context } from '..';
import IngredientGQL from './ingredientGQL';
import InstructionGQL from './instructionGQL';
import UserGQL from './userGQL';

class RecipeGQL {
  id: string;
  ownerId: string;
  cookbookId: string;
  title: string;
  description: string;
  isPublic: boolean;
  _likes: Array<String>;

  constructor(recipeModel: RecipeModel) {
    this.id = recipeModel.id;
    this.ownerId = recipeModel.ownerId;
    this.cookbookId = recipeModel.cookbookId;
    this.title = recipeModel.title;
    this.description = recipeModel.description;
    this.isPublic = recipeModel.isPublic;
    this._likes = recipeModel.likes;
  }

  async owner(_args: {}, context: Context): Promise<UserGQL | null> {
    const userModel = await context.dataSources.userAPI.getUser({ id: this.ownerId });
    if (!userModel) return null;
    return new UserGQL(userModel);
  }

  async ingredients(_args: {}, context: Context): Promise<Array<IngredientGQL>> {
    return (await context.dataSources.ingredientAPI.getIngredients(this.id)).map(
      (ingredientModel) => new IngredientGQL(ingredientModel)
    );
  }

  async instructions(_args: {}, context: Context): Promise<Array<InstructionGQL>> {
    return (await context.dataSources.instructionAPI.getInstructions(this.id)).map(
      (instructionModel) => new InstructionGQL(instructionModel)
    );
  }

  likes(_args: {}, _context: Context): Number {
    return this._likes.length;
  }

  isFavorite(_args: {}, context: Context): boolean {
    if (!context.user) return false;
    return context.user.favoriteRecipes.includes(this.id);
  }

  isLiked(_args: {}, context: Context): boolean {
    if (!context.user) return false;
    return this._likes.includes(context.user.id);
  }
}

export default RecipeGQL;
