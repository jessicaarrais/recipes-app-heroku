import { ReadStream } from 'fs';
import { Context } from '.';
import { RecipeModel } from './store';
import {
  InstructionDeleteResponseGQL,
  MeResponseGQL,
  AuthResponseGQL,
  AvatarResponseGQL,
  FavoriteRecipesResponseGQL,
  RecipeCreateResponseGQL,
  RecipeUpdateResponseGQL,
  RecipeDeleteResponseGQL,
  IngredientCreateResponseGQL,
  IngredientUpdateResponseGQL,
  IngredientDeleteResponseGQL,
  InstructionCreateResponseGQL,
  InstructionUpdateResponseGQL,
} from './schema';
import UserGQL from './graphql_models/userGQL';
import CookbookGQL from './graphql_models/cookbookGQL';
import RecipeGQL from './graphql_models/recipeGQL';
import IngredientGQL from './graphql_models/ingredientGQL';
import InstructionGQl from './graphql_models/instructionGQL';

const resolvers = {
  Query: {
    me: (_, __, context: Context): UserGQL => {
      return context.user ? new UserGQL(context.user) : null;
    },

    user: async (
      _,
      args: { username: string; id: string },
      context: Context
    ): Promise<UserGQL> => {
      const userModel = await context.dataSources.userAPI.getUser({
        username: args.username,
        id: args.id,
      });
      if (!userModel) return null;
      return new UserGQL(userModel);
    },

    recipe: async (
      _,
      args: { recipeId: string; cookbookId: string },
      context: Context
    ): Promise<RecipeGQL> => {
      const recipeModel = await context.dataSources.recipeAPI.getRecipe(args.recipeId);
      if (!recipeModel || args.cookbookId != recipeModel.cookbookId) return null;
      return new RecipeGQL(recipeModel);
    },

    searchRecipes: async (
      _,
      args: { value: string },
      context: Context
    ): Promise<Array<RecipeGQL>> => {
      const recipesModel = await context.dataSources.recipeAPI.searchRecipes(args.value);
      if (!recipesModel) return null;
      return recipesModel.map((recipe: RecipeModel) => new RecipeGQL(recipe));
    },
  },

  Mutation: {
    signup: async (
      _,
      args: {
        email: string;
        username: string;
        password: string;
        confirmPassword: string;
      },
      context: Context
    ): Promise<AuthResponseGQL> => {
      try {
        const { userModel, token } = await context.dataSources.userAPI.createUser({
          email: args.email,
          username: args.username,
          password: args.password,
          confirmPassword: args.confirmPassword,
        });
        context.user = userModel;
        return {
          success: true,
          message: 'Created',
          token,
          me: new UserGQL(userModel),
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          token: null,
          me: null,
        };
      }
    },

    login: async (
      _,
      args: { email: string; password: string },
      context: Context
    ): Promise<AuthResponseGQL> => {
      try {
        const { userModel, token } = await context.dataSources.userAPI.login({
          email: args.email,
          password: args.password,
        });
        context.user = userModel;
        return {
          success: true,
          message: 'Logged',
          token,
          me: new UserGQL(userModel),
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          token: null,
          me: null,
        };
      }
    },

    updateUser: async (
      _,
      args: { username: string },
      context: Context
    ): Promise<MeResponseGQL> => {
      try {
        const meModel = await context.dataSources.userAPI.updateUser({
          username: args.username,
        });
        return {
          success: true,
          message: 'Updated',
          me: new UserGQL(meModel),
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          me: null,
        };
      }
    },

    logout: async (_, __, context: Context): Promise<MeResponseGQL> => {
      const me = await context.dataSources.userAPI.logout();
      if (!me) {
        return {
          success: false,
          message: 'Logout failed',
          me: null,
        };
      }
      return { success: true, message: 'User loggedout', me: new UserGQL(me) };
    },

    addRecipeToFavorites: async (
      _,
      args: { recipeId: string },
      context: Context
    ): Promise<FavoriteRecipesResponseGQL> => {
      const me = await context.dataSources.userAPI.addRecipeToFavorites(args.recipeId);
      if (!me) {
        return {
          success: false,
          message: 'Could not add recipe to favorites',
          recipe: null,
        };
      }
      context.user = me;
      const recipeModel = await context.dataSources.recipeAPI.getRecipe(args.recipeId);
      return {
        success: true,
        message: 'Recipe added to favorites',
        recipe: new RecipeGQL(recipeModel),
      };
    },

    removeRecipeFromFavorites: async (
      _,
      args: { recipeId: string },
      context: Context
    ): Promise<FavoriteRecipesResponseGQL> => {
      const me = await context.dataSources.userAPI.removeRecipeFromFavorites(
        args.recipeId
      );
      if (!me) {
        return {
          success: false,
          message: 'Could not remove recipe from favorites',
          recipe: null,
        };
      }
      context.user = me;
      const recipeModel = await context.dataSources.recipeAPI.getRecipe(args.recipeId);
      return {
        success: true,
        message: 'Recipe removed from favorites',
        recipe: new RecipeGQL(recipeModel),
      };
    },

    deleteUser: async (_, __, context: Context): Promise<MeResponseGQL> => {
      const me = new UserGQL(context.user);
      const deletedUser = await context.dataSources.userAPI.deleteUser();
      if (!deletedUser) {
        return {
          success: false,
          message: 'User not deleted',
          me: null,
        };
      }
      return { success: true, message: 'User deleted', me };
    },

    uploadAvatar: async (
      _,
      args: {
        file: {
          filename: string;
          mimetype: string;
          encoding: string;
          createReadStream: () => ReadStream;
        };
      },
      context: Context
    ): Promise<AvatarResponseGQL> => {
      try {
        await context.dataSources.avatarAPI.uploadAvatar(args);
        return {
          success: true,
          message: 'Avatar updated',
          me: new UserGQL(context.user),
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          me: null,
        };
      }
    },

    createRecipe: async (_, __, context: Context): Promise<RecipeCreateResponseGQL> => {
      const recipeModel = await context.dataSources.recipeAPI.createRecipe();
      if (!recipeModel) {
        return {
          success: false,
          message: 'Failed creating recipe',
          cookbook: null,
        };
      }
      const cookbookModel = await context.dataSources.cookbookAPI.getCookbook(
        context.user.id
      );
      return {
        success: true,
        message: 'Recipe created',
        cookbook: new CookbookGQL(cookbookModel),
      };
    },

    updateRecipe: async (
      _,
      args: { title: string; isPublic: boolean; recipeId: string },
      context: Context
    ): Promise<RecipeUpdateResponseGQL> => {
      const recipeModel = await context.dataSources.recipeAPI.updateRecipe(
        { title: args.title, isPublic: args.isPublic },
        args.recipeId
      );
      if (!recipeModel) {
        return {
          success: false,
          message: 'Failed to update recipe',
          recipe: null,
        };
      }
      return {
        success: true,
        message: 'Recipe updated',
        recipe: new RecipeGQL(recipeModel),
      };
    },

    deleteRecipe: async (
      _,
      args: { recipeId: string },
      context: Context
    ): Promise<RecipeDeleteResponseGQL> => {
      const recipeModel = await context.dataSources.recipeAPI.deleteRecipe(args.recipeId);
      if (!recipeModel) {
        return {
          success: false,
          message: 'Failed to delete recipe',
          cookbook: null,
        };
      }
      const cookbookModel = await context.dataSources.cookbookAPI.getCookbook(
        context.user.id
      );
      return {
        success: true,
        message: 'Recipe deleted',
        cookbook: new CookbookGQL(cookbookModel),
      };
    },

    createIngredient: async (
      _,
      args: { text: any; isChecked: any; recipeId: string },
      context: Context
    ): Promise<IngredientCreateResponseGQL> => {
      const newIngredientModel = await context.dataSources.ingredientAPI.createIngredient(
        {
          text: args.text,
          isChecked: args.isChecked,
          recipeId: args.recipeId,
        }
      );
      if (!newIngredientModel) {
        return {
          success: false,
          message: 'Failed creating ingredient',
          recipe: null,
        };
      }
      const recipeModel = await context.dataSources.recipeAPI.getRecipe(args.recipeId);
      return {
        success: true,
        message: 'Ingredient created',
        recipe: new RecipeGQL(recipeModel),
      };
    },

    updateIngredient: async (
      _,
      args: { text: string; isChecked: boolean; ingredientId: string },
      context: Context
    ): Promise<IngredientUpdateResponseGQL> => {
      const ingredientModel = await context.dataSources.ingredientAPI.updateIngredient(
        { text: args.text, isChecked: args.isChecked },
        args.ingredientId
      );
      if (!ingredientModel) {
        return {
          success: false,
          message: 'Failed updating ingredient',
          ingredient: null,
        };
      }
      return {
        success: true,
        message: 'Ingredient updated',
        ingredient: new IngredientGQL(ingredientModel),
      };
    },

    deleteIngredient: async (
      _,
      args: { ingredientId: string; recipeId: string },
      context: Context
    ): Promise<IngredientDeleteResponseGQL> => {
      const ingredientModel = await context.dataSources.ingredientAPI.deleteIngredient(
        args.ingredientId
      );
      if (!ingredientModel) {
        return {
          success: false,
          message: 'Failed deleting ingredient',
          recipe: null,
        };
      }
      const recipeModel = await context.dataSources.recipeAPI.getRecipe(args.recipeId);
      return {
        success: true,
        message: 'Ingredient deleted',
        recipe: new RecipeGQL(recipeModel),
      };
    },

    createInstruction: async (
      _,
      args: { step: string; text: string; recipeId: string },
      context: Context
    ): Promise<InstructionCreateResponseGQL> => {
      const newInstructionModel = await context.dataSources.instructionAPI.createInstruction(
        { step: args.step, text: args.text, recipeId: args.recipeId }
      );
      if (!newInstructionModel) {
        return {
          success: false,
          message: 'Faild creating instruction',
          recipe: null,
        };
      }
      const recipeModel = await context.dataSources.recipeAPI.getRecipe(args.recipeId);
      return {
        success: true,
        message: 'Ingredient created',
        recipe: new RecipeGQL(recipeModel),
      };
    },

    updateInstruction: async (
      _,
      args: { step: string; text: string; instructionId: string; recipeId: string },
      context: Context
    ): Promise<InstructionUpdateResponseGQL> => {
      const instructionModel = await context.dataSources.instructionAPI.updateInstruction(
        { step: args.step, text: args.text },
        args.instructionId,
        args.recipeId
      );
      if (!instructionModel) {
        return {
          success: false,
          message: 'Faild updating instruction',
          instruction: null,
        };
      }
      return {
        success: true,
        message: 'Instruction updated',
        instruction: new InstructionGQl(instructionModel),
      };
    },

    deleteInstruction: async (
      _,
      args: { instructionId: string; recipeId: string },
      context: Context
    ): Promise<InstructionDeleteResponseGQL> => {
      const instructionModel = context.dataSources.instructionAPI.deleteInstruction(
        args.instructionId,
        args.recipeId
      );
      if (!instructionModel) {
        return {
          success: false,
          message: 'Faild deleting instruction',
          recipe: null,
        };
      }
      const recipeModel = await context.dataSources.recipeAPI.getRecipe(args.recipeId);
      return {
        success: true,
        message: 'Ingredient created',
        recipe: new RecipeGQL(recipeModel),
      };
    },
  },
};

export default resolvers;
