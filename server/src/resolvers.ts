import { Context } from '.';
import {
  UserResponseGQL,
  AvatarResponseGQL,
  TodoCreateResponseGQL,
  TodoUpdateResponseGQL,
  TodoDeleteResponseGQL,
  SheetCreateResponseGQL,
  SheetUpdateResponseGQL,
  SheetDeleteResponseGQL,
} from './schema';
import UserGQL from './graphql_models/userGQL';
import AvatarGQL from './graphql_models/AvatarGQL';
import SheetGQL from './graphql_models/sheetGQL';
import TodoGQL from './graphql_models/todoGQL';
import NotebookGQL from './graphql_models/notebookGQL';

const resolvers = {
  Query: {
    user: async (_, __, context: Context): Promise<UserGQL> => {
      const userModel = await context.dataSources.userAPI.getUser();
      if (!userModel) return null;
      return new UserGQL(userModel);
    },
  },

  Mutation: {
    createTodo: async (_, args, context: Context): Promise<TodoCreateResponseGQL> => {
      const newTodoModel = await context.dataSources.todoAPI.createTodo({
        text: args.text,
        isChecked: args.isChecked,
        sheetId: args.sheetId,
      });
      if (!newTodoModel) {
        return {
          success: false,
          message: 'Failed creating todo',
          sheet: null,
        };
      }
      const sheetModel = await context.dataSources.sheetAPI.getSheet(args.sheetId);
      return {
        success: true,
        message: 'Todo created',
        sheet: new SheetGQL(sheetModel),
      };
    },

    updateTodo: async (_, args, context: Context): Promise<TodoUpdateResponseGQL> => {
      const todoModel = await context.dataSources.todoAPI.updateTodo(
        { text: args.text, isChecked: args.isChecked },
        args.todoId
      );
      if (!todoModel) {
        return {
          success: false,
          message: 'Failed updating todo',
          todo: null,
        };
      }
      return {
        success: true,
        message: 'Todo updated',
        todo: new TodoGQL(todoModel),
      };
    },

    deleteTodo: async (_, args, context: Context): Promise<TodoDeleteResponseGQL> => {
      const todoModel = await context.dataSources.todoAPI.deleteTodo(args.todoId);
      if (!todoModel) {
        return {
          success: false,
          message: 'Failed deleting todo',
          sheet: null,
        };
      }
      const sheetModel = await context.dataSources.sheetAPI.getSheet(args.sheetId);
      return {
        success: true,
        message: 'Todo deleted',
        sheet: new SheetGQL(sheetModel),
      };
    },

    createSheet: async (_, args, context: Context): Promise<SheetCreateResponseGQL> => {
      const sheetModel = await context.dataSources.sheetAPI.createSheet({
        title: args.title,
        notebookId: args.notebookId,
      });
      if (!sheetModel) {
        return {
          success: false,
          message: 'Failed creating sheet',
          notebook: null,
        };
      }
      const notebookModel = await context.dataSources.notebookAPI.getNotebook(
        context.user.id
      );
      return {
        success: true,
        message: 'Sheet created',
        notebook: new NotebookGQL(notebookModel),
      };
    },

    updateSheet: async (_, args, context: Context): Promise<SheetUpdateResponseGQL> => {
      const sheetModel = await context.dataSources.sheetAPI.updateSheet(
        { title: args.title },
        args.sheetId
      );
      if (!sheetModel) {
        return {
          success: false,
          message: 'Failed to update sheet',
          sheet: null,
        };
      }
      return {
        success: true,
        message: 'Sheet updated',
        sheet: new SheetGQL(sheetModel),
      };
    },

    deleteSheet: async (_, args, context: Context): Promise<SheetDeleteResponseGQL> => {
      const sheetModel = await context.dataSources.sheetAPI.deleteSheet(args.sheetId);
      if (!sheetModel) {
        return {
          success: false,
          message: 'Failed to delete sheet',
          notebook: null,
        };
      }
      const notebookModel = await context.dataSources.notebookAPI.getNotebook(
        context.user.id
      );
      return {
        success: true,
        message: 'Sheet deleted',
        notebook: new NotebookGQL(notebookModel),
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
