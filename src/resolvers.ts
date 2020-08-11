import { Context } from '.';
import { RecipeModel } from './store';
import {
  MeResponseGQL,
  AvatarResponseGQL,
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
import InstructionGQl from './graphql_models/instructionGQL';

const resolvers = {
  Query: {
    me: async (_, __, context: Context): Promise<UserGQL> => {
      const meModel = await context.dataSources.userAPI.getUser();
      if (!meModel) return null;
      return new UserGQL(meModel);
    },

    user: async (_, args, context: Context): Promise<UserGQL> => {
      const userModel = await context.dataSources.userAPI.getUser({
        username: args.username,
      });
      if (!userModel) return null;
      return new UserGQL(userModel);
    },

    searchRecipes: async (_, args, context: Context): Promise<Array<RecipeGQL>> => {
      const recipesModel = await context.dataSources.recipeAPI.searchRecipes(args.value);
      if (!recipesModel) return null;
      return recipesModel.map((recipe: RecipeModel) => new RecipeGQL(recipe));
    },
  },

  Mutation: {
    signup: async (_, args, context: Context): Promise<MeResponseGQL> => {
      try {
        const newUserModel = await context.dataSources.userAPI.createUser({
          email: args.email,
          username: args.username,
        });
        context.user = newUserModel;
        return {
          success: true,
          message: 'Created',
          me: new UserGQL(newUserModel),
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          me: null,
        };
      }
    },

    login: async (_, args, context: Context): Promise<MeResponseGQL> => {
      try {
        const meModel = await context.dataSources.userAPI.findUserByEmail(args.email);
        context.user = meModel;
        return {
          success: true,
          message: 'Logged',
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

    updateUser: async (_, args, context: Context): Promise<MeResponseGQL> => {
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

    uploadAvatar: async (_, args, context: Context): Promise<AvatarResponseGQL> => {
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

    createInstruction: async (
      _,
      args,
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
        message: 'Todo created',
        recipe: new RecipeGQL(recipeModel),
      };
    },

    updateInstruction: async (
      _,
      args,
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
      args,
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
        message: 'Todo created',
        recipe: new RecipeGQL(recipeModel),
      };
    },
  },
};

export default resolvers;
