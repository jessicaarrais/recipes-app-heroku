import { ReadStream } from 'fs';
import { Context } from '.';
import { RecipeModel } from './store';
import {
  MeResponseGQL,
  AuthResponseGQL,
  AvatarResponseGQL,
  FavoriteRecipesResponseGQL,
  LikesResponseGQL,
  RecipeCreateResponseGQL,
  RecipeUpdateResponseGQL,
  RecipeDeleteResponseGQL,
  IngredientCreateResponseGQL,
  IngredientUpdateResponseGQL,
  IngredientDeleteResponseGQL,
  InstructionCreateResponseGQL,
  InstructionUpdateResponseGQL,
  InstructionDeleteResponseGQL,
} from './schema';
import UserGQL from './graphql_models/userGQL';
import CookbookGQL from './graphql_models/cookbookGQL';
import RecipeGQL from './graphql_models/recipeGQL';
import IngredientGQL from './graphql_models/ingredientGQL';
import InstructionGQL from './graphql_models/instructionGQL';
import ErrorResponseGQL from './graphql_models/errorResponseGQL';

const resolvers = {
  Query: {
    me: (_: undefined, __: {}, { user }: Context): UserGQL | null => {
      return user ? new UserGQL(user) : null;
    },

    user: async (
      _: undefined,
      args: { username?: string; id?: string },
      { dataSources }: Context
    ): Promise<UserGQL | null> => {
      const userModel = await dataSources.userAPI.getUser(args);
      return userModel ? new UserGQL(userModel) : null;
    },

    recipe: async (
      _: undefined,
      args: { recipeId: string; cookbookId: string },
      { dataSources }: Context
    ): Promise<RecipeGQL | null> => {
      const recipeModel = await dataSources.recipeAPI.getRecipe(args.recipeId);
      if (!recipeModel || args.cookbookId != recipeModel.cookbookId) return null;
      return new RecipeGQL(recipeModel);
    },

    searchRecipes: async (
      _: undefined,
      args: { value: string },
      { dataSources }: Context
    ): Promise<Array<RecipeGQL> | null> => {
      const recipesModel = await dataSources.recipeAPI.searchRecipes(args.value);
      if (!recipesModel) return null;
      return recipesModel.map((recipe: RecipeModel) => new RecipeGQL(recipe));
    },
  },

  Mutation: {
    signup: async (
      _: undefined,
      args: {
        email: string;
        username: string;
        password: string;
        confirmPassword: string;
      },
      { dataSources }: Context
    ): Promise<AuthResponseGQL | ErrorResponseGQL> => {
      try {
        const token = await dataSources.userAPI.createUser(args);
        return {
          success: true,
          message: 'Created',
          token,
        };
      } catch (error) {
        return new ErrorResponseGQL(error.message);
      }
    },

    login: async (
      _: undefined,
      args: { email: string; password: string },
      { dataSources }: Context
    ): Promise<AuthResponseGQL | ErrorResponseGQL> => {
      try {
        const token = await dataSources.userAPI.login(args);
        return {
          success: true,
          message: 'Logged',
          token,
        };
      } catch (error) {
        return new ErrorResponseGQL(error.message);
      }
    },

    updateUser: async (
      _: undefined,
      args: { username: string },
      { dataSources }: Context
    ): Promise<MeResponseGQL | ErrorResponseGQL> => {
      try {
        const meModel = await dataSources.userAPI.updateUser(args);
        if (!meModel) throw new Error('User is not logged in');
        return {
          success: true,
          message: 'Updated',
          me: new UserGQL(meModel),
        };
      } catch (error) {
        return new ErrorResponseGQL(error.message);
      }
    },

    logout: async (
      _: undefined,
      __: {},
      { dataSources }: Context
    ): Promise<MeResponseGQL | ErrorResponseGQL> => {
      const meModel = await dataSources.userAPI.logout();
      if (!meModel) return new ErrorResponseGQL('User is not logged in');
      return { success: true, message: 'User logged out', me: new UserGQL(meModel) };
    },

    addRecipeToFavorites: async (
      _: undefined,
      args: { recipeId: string },
      { dataSources }: Context
    ): Promise<FavoriteRecipesResponseGQL | ErrorResponseGQL> => {
      const meModel = await dataSources.userAPI.addRecipeToFavorites(args.recipeId);
      if (!meModel) return new ErrorResponseGQL('User is not logged in');
      const recipeModel = await dataSources.recipeAPI.getRecipe(args.recipeId);
      if (!recipeModel) return new ErrorResponseGQL('Could not retrieve recipe');
      return {
        success: true,
        message: 'Recipe added to favorites',
        recipe: new RecipeGQL(recipeModel),
      };
    },

    removeRecipeFromFavorites: async (
      _: undefined,
      args: { recipeId: string },
      { dataSources }: Context
    ): Promise<FavoriteRecipesResponseGQL | ErrorResponseGQL> => {
      const meModel = await dataSources.userAPI.removeRecipeFromFavorites(args.recipeId);
      if (!meModel) return new ErrorResponseGQL('User is not logged in');
      const recipeModel = await dataSources.recipeAPI.getRecipe(args.recipeId);
      if (!recipeModel) return new ErrorResponseGQL('Could not retrieve recipe');
      return {
        success: true,
        message: 'Recipe removed from favorites',
        recipe: new RecipeGQL(recipeModel),
      };
    },

    likeRecipe: async (
      _: undefined,
      args: { recipeId: string },
      { dataSources }: Context
    ): Promise<LikesResponseGQL | ErrorResponseGQL> => {
      const recipeModel = await dataSources.recipeAPI.likeRecipe(args.recipeId);
      if (!recipeModel) return new ErrorResponseGQL('Failed liking recipe');
      return {
        success: true,
        message: 'Liked this recipe',
        recipe: new RecipeGQL(recipeModel),
      };
    },

    unlikeRecipe: async (
      _: undefined,
      args: { recipeId: string },
      { dataSources }: Context
    ): Promise<LikesResponseGQL | ErrorResponseGQL> => {
      const recipeModel = await dataSources.recipeAPI.unlikeRecipe(args.recipeId);
      if (!recipeModel) return new ErrorResponseGQL('Failed liking recipe');
      return {
        success: true,
        message: 'Unliked this recipe',
        recipe: new RecipeGQL(recipeModel),
      };
    },

    deleteUser: async (
      _: undefined,
      __: {},
      { user, dataSources }: Context
    ): Promise<MeResponseGQL | ErrorResponseGQL> => {
      if (!user) return new ErrorResponseGQL('No user logged in');
      const me = new UserGQL(user);
      const deletedUser = await dataSources.userAPI.deleteUser();
      if (!deletedUser) return new ErrorResponseGQL('User not deleted');
      return { success: true, message: 'User deleted', me };
    },

    uploadAvatar: async (
      _: undefined,
      args: {
        file: {
          filename: string;
          mimetype: string;
          encoding: string;
          createReadStream: () => ReadStream;
        };
      },
      { user, dataSources }: Context
    ): Promise<AvatarResponseGQL | ErrorResponseGQL> => {
      try {
        if (!user) throw new Error('No user logged in');
        const avatarModel = await dataSources.avatarAPI.uploadAvatar(args);
        if (!avatarModel) throw new Error('Could not upload avatar');
        return {
          success: true,
          message: 'Avatar updated',
          me: new UserGQL(user),
        };
      } catch (error) {
        return new ErrorResponseGQL(error.message);
      }
    },

    createRecipe: async (
      _: undefined,
      args: { title: string; description: string },
      { dataSources }: Context
    ): Promise<RecipeCreateResponseGQL | ErrorResponseGQL> => {
      const recipeModel = await dataSources.recipeAPI.createRecipe(args);
      if (!recipeModel) return new ErrorResponseGQL('User is not logged in');
      const cookbookModel = await dataSources.cookbookAPI.getCookbook(
        recipeModel.ownerId
      );
      if (!cookbookModel) return new ErrorResponseGQL('Could not retrieve cookbook');
      return {
        success: true,
        message: 'Recipe created',
        recipe: new RecipeGQL(recipeModel),
      };
    },

    updateRecipe: async (
      _: undefined,
      args: {
        title?: string;
        description?: string;
        isPublic?: boolean;
        recipeId: string;
      },
      { dataSources }: Context
    ): Promise<RecipeUpdateResponseGQL | ErrorResponseGQL> => {
      const recipeModel = await dataSources.recipeAPI.updateRecipe(
        { title: args.title, description: args.description, isPublic: args.isPublic },
        args.recipeId
      );
      if (!recipeModel) return new ErrorResponseGQL('Failed to update recipe');
      return {
        success: true,
        message: 'Recipe updated',
        recipe: new RecipeGQL(recipeModel),
      };
    },

    deleteRecipe: async (
      _: undefined,
      args: { recipeId: string },
      { user, dataSources }: Context
    ): Promise<RecipeDeleteResponseGQL | ErrorResponseGQL> => {
      if (!user) return new ErrorResponseGQL('No user is logged in');
      const recipeModel = await dataSources.recipeAPI.deleteRecipe(args.recipeId);
      if (!recipeModel) return new ErrorResponseGQL('Failed to delete recipe');
      const cookbookModel = await dataSources.cookbookAPI.getCookbook(user.id);
      if (!cookbookModel) return new ErrorResponseGQL('Could not retrieve cookbook');
      return {
        success: true,
        message: 'Recipe deleted',
        cookbook: new CookbookGQL(cookbookModel),
      };
    },

    createIngredient: async (
      _: undefined,
      args: { text: string; isChecked: boolean; recipeId: string; instructionId: string },
      { dataSources }: Context
    ): Promise<IngredientCreateResponseGQL | ErrorResponseGQL> => {
      const newIngredientModel = await dataSources.ingredientAPI.createIngredient(args);
      if (!newIngredientModel) return new ErrorResponseGQL('Failed creating ingredient');
      const recipeModel = await dataSources.recipeAPI.getRecipe(args.recipeId);
      if (!recipeModel) return new ErrorResponseGQL('Could not retrieve recipe');
      return {
        success: true,
        message: 'Ingredient created',
        recipe: new RecipeGQL(recipeModel),
      };
    },

    updateIngredient: async (
      _: undefined,
      args: {
        text?: string;
        isChecked?: boolean;
        ingredientId: string;
        recipeId: string;
      },
      { dataSources }: Context
    ): Promise<IngredientUpdateResponseGQL | ErrorResponseGQL> => {
      const ingredientModel = await dataSources.ingredientAPI.updateIngredient(
        { text: args.text, isChecked: args.isChecked },
        args.ingredientId,
        args.recipeId
      );
      if (!ingredientModel) return new ErrorResponseGQL('Failed updating ingredient');
      return {
        success: true,
        message: 'Ingredient updated',
        ingredient: new IngredientGQL(ingredientModel),
      };
    },

    deleteIngredient: async (
      _: undefined,
      args: { ingredientId: string; recipeId: string },
      { dataSources }: Context
    ): Promise<IngredientDeleteResponseGQL | ErrorResponseGQL> => {
      const ingredientModel = await dataSources.ingredientAPI.deleteIngredient(args);
      if (!ingredientModel) return new ErrorResponseGQL('Failed deleting ingredient');
      const recipeModel = await dataSources.recipeAPI.getRecipe(args.recipeId);
      if (!recipeModel) return new ErrorResponseGQL('Could not retrieve recipe');
      return {
        success: true,
        message: 'Ingredient deleted',
        recipe: new RecipeGQL(recipeModel),
      };
    },

    createInstruction: async (
      _: undefined,
      args: { step: string; description: string; tip: string; recipeId: string },
      { dataSources }: Context
    ): Promise<InstructionCreateResponseGQL | ErrorResponseGQL> => {
      const newInstructionModel = await dataSources.instructionAPI.createInstruction(
        args
      );
      if (!newInstructionModel)
        return new ErrorResponseGQL('Failed creating instruction');
      const recipeModel = await dataSources.recipeAPI.getRecipe(args.recipeId);
      if (!recipeModel) return new ErrorResponseGQL('Failed retrieving recipe');
      return {
        success: true,
        message: 'Ingredient created',
        recipe: new RecipeGQL(recipeModel),
      };
    },

    updateInstruction: async (
      _: undefined,
      args: {
        step?: string;
        description?: string;
        tip?: string;
        instructionId: string;
        recipeId: string;
      },
      { dataSources }: Context
    ): Promise<InstructionUpdateResponseGQL | ErrorResponseGQL> => {
      const instructionModel = await dataSources.instructionAPI.updateInstruction(
        { step: args.step, description: args.description, tip: args.tip },
        args.instructionId,
        args.recipeId
      );
      if (!instructionModel) return new ErrorResponseGQL('Failed updating instruction');
      return {
        success: true,
        message: 'Instruction updated',
        instruction: new InstructionGQL(instructionModel),
      };
    },

    deleteInstruction: async (
      _: undefined,
      args: { instructionId: string; recipeId: string },
      { dataSources }: Context
    ): Promise<InstructionDeleteResponseGQL | ErrorResponseGQL> => {
      const instructionModel = await dataSources.instructionAPI.deleteInstruction(args);
      if (!instructionModel) return new ErrorResponseGQL('Failed deleting instruction');
      const recipeModel = await dataSources.recipeAPI.getRecipe(args.recipeId);
      if (!recipeModel) return new ErrorResponseGQL('Failed retrieving recipe');
      return {
        success: true,
        message: 'Instruction deleted',
        recipe: new RecipeGQL(recipeModel),
      };
    },
  },
};

export default resolvers;
