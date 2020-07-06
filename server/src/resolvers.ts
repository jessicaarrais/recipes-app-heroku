import { Context } from '.';
import {
  UserResponseGQL,
  AvatarResponseGQL,
  IngredientCreateResponseGQL,
  IngredientUpdateResponseGQL,
  IngredientDeleteResponseGQL,
  RecipeCreateResponseGQL,
  RecipeUpdateResponseGQL,
  RecipeDeleteResponseGQL,
} from './schema';
import UserGQL from './graphql_models/userGQL';
import RecipeGQL from './graphql_models/recipeGQL';
import IngredientGQL from './graphql_models/ingredientGQL';
import CookbookGQL from './graphql_models/cookbookGQL';

const resolvers = {
  Query: {
    user: async (_, __, context: Context): Promise<UserGQL> => {
      const userModel = await context.dataSources.userAPI.getUser();
      if (!userModel) return null;
      return new UserGQL(userModel);
    },
  },

  Mutation: {
    createIngredient: async (
      _,
      args,
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
          message: 'Failed creating todo',
          recipe: null,
        };
      }
      const recipeModel = await context.dataSources.recipeAPI.getRecipe(args.recipeId);
      return {
        success: true,
        message: 'Todo created',
        recipe: new RecipeGQL(recipeModel),
      };
    },

    updateIngredient: async (
      _,
      args,
      context: Context
    ): Promise<IngredientUpdateResponseGQL> => {
      const ingredientModel = await context.dataSources.ingredientAPI.updateIngredient(
        { text: args.text, isChecked: args.isChecked },
        args.ingredientId
      );
      if (!ingredientModel) {
        return {
          success: false,
          message: 'Failed updating todo',
          ingredient: null,
        };
      }
      return {
        success: true,
        message: 'Todo updated',
        ingredient: new IngredientGQL(ingredientModel),
      };
    },

    deleteIngredient: async (
      _,
      args,
      context: Context
    ): Promise<IngredientDeleteResponseGQL> => {
      const ingredientModel = await context.dataSources.ingredientAPI.deleteIngredient(
        args.ingredientId
      );
      if (!ingredientModel) {
        return {
          success: false,
          message: 'Failed deleting todo',
          recipe: null,
        };
      }
      const recipeModel = await context.dataSources.recipeAPI.getRecipe(args.recipeId);
      return {
        success: true,
        message: 'Todo deleted',
        recipe: new RecipeGQL(recipeModel),
      };
    },

    createRecipe: async (_, args, context: Context): Promise<RecipeCreateResponseGQL> => {
      const recipeModel = await context.dataSources.recipeAPI.createRecipe({
        title: args.title,
        cookbookId: args.cookbookId,
      });
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

    updateRecipe: async (_, args, context: Context): Promise<RecipeUpdateResponseGQL> => {
      const recipeModel = await context.dataSources.recipeAPI.updateRecipe(
        { title: args.title },
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

    deleteRecipe: async (_, args, context: Context): Promise<RecipeDeleteResponseGQL> => {
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

    signin: async (_, args, context: Context): Promise<UserResponseGQL> => {
      try {
        const newUserModel = await context.dataSources.userAPI.createUser({
          email: args.email,
          username: args.username,
        });
        return {
          success: true,
          message: 'Created',
          user: new UserGQL(newUserModel),
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          user: null,
        };
      }
    },

    login: async (_, args, context: Context): Promise<UserResponseGQL> => {
      try {
        const userModel = await context.dataSources.userAPI.findUserByEmail(args.email);
        return {
          success: true,
          message: 'Logged',
          user: new UserGQL(userModel),
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          user: null,
        };
      }
    },

    updateUser: async (_, args, context: Context): Promise<UserResponseGQL> => {
      try {
        const userModel = await context.dataSources.userAPI.updateUser({
          username: args.username,
        });
        return {
          success: true,
          message: 'Updated',
          user: new UserGQL(userModel),
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          user: null,
        };
      }
    },

    deleteUser: async (_, __, context: Context): Promise<UserResponseGQL> => {
      const user = new UserGQL(context.user);
      const deletedUser = await context.dataSources.userAPI.deleteUser();
      if (!deletedUser) {
        return {
          success: false,
          message: 'User not deleted',
          user: null,
        };
      }
      return { success: true, message: 'User deleted', user };
    },

    uploadAvatar: async (_, args, context: Context): Promise<AvatarResponseGQL> => {
      try {
        const avatarModel = await context.dataSources.avatarAPI.uploadAvatar(args);
        return {
          success: true,
          message: 'Avatar updated',
          user: new UserGQL(context.user),
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          user: null,
        };
      }
    },
  },
};

export default resolvers;
