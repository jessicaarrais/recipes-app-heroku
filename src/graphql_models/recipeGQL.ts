import { RecipeModel } from '../store';
import { Context } from '..';
import IngredientGQL from './ingredientGQL';
import InstructionGQl from './instructionGQL';
import UserGQL from './userGQL';

class RecipeGQL {
  id: string;
  ownerId: string;
  cookbookId: string;
  title: string;
  isPublic: boolean;

  constructor(recipeModel: RecipeModel) {
    this.id = recipeModel.id;
    this.ownerId = recipeModel.ownerId;
    this.cookbookId = recipeModel.cookbookId;
    this.title = recipeModel.title;
    this.isPublic = recipeModel.isPublic;
  }

  async owner(_args, context: Context): Promise<UserGQL> {
    const userModel = await context.dataSources.userAPI.getUser({ id: this.ownerId });
    return new UserGQL(userModel);
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

  isFavorite(_args, context: Context): boolean {
    return context.user.favoriteRecipes.includes(this.id);
  }
}

export default RecipeGQL;
