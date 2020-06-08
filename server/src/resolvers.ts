import { Context } from '.';
import {
  TodoUpdateResponseGQL,
  SheetUpdateResponseGQL,
  UserResponseGQL,
  UserGQL,
  TodoCreateResponseGQL,
  TodoDeleteResponseGQL,
  SheetDeleteResponseGQL,
  SheetCreateResponseGQL,
} from './schema';

const resolvers = {
  Query: {
    user: async (_, __, context: Context): Promise<UserGQL> =>
      context.user
        ? {
            id: context.user.id,
            username: context.user.username,
            email: context.user.email,
            token: context.user.token,
            notebook: {
              id: context.user.notebookId,
              sheets: await context.dataSources.sheetAPI.getSheets(
                context.user.notebookId
              ),
            },
          }
        : null,
  },

  Mutation: {
    createTodo: async (_, args, context: Context): Promise<TodoCreateResponseGQL> => {
      const response = await context.dataSources.todoAPI.createTodo({
        text: args.text,
        isChecked: args.isChecked,
        sheetId: args.sheetId,
      });
      if (!response) {
        return {
          success: false,
          message: 'Failed creating todo',
          sheet: null,
        };
      }
      const { id, title, notebookId } = await context.dataSources.sheetAPI.getSheet(
        args.sheetId
      );
      const todos = await context.dataSources.todoAPI.getTodos(args.sheetId);
      return {
        success: true,
        message: 'Todo created',
        sheet: { id, notebookId, title, todos },
      };
    },

    updateTodo: async (_, args, context: Context): Promise<TodoUpdateResponseGQL> => {
      const todo = await context.dataSources.todoAPI.updateTodo(
        { text: args.text, isChecked: args.isChecked },
        args.todoId
      );
      if (!todo) {
        return {
          success: false,
          message: 'Failed updating todo',
          todo: null,
        };
      }
      return {
        success: true,
        message: 'Todo updated',
        todo: {
          id: todo.id,
          sheetId: todo.sheetId,
          text: todo.text,
          isChecked: todo.isChecked,
        },
      };
    },

    deleteTodo: async (_, args, context: Context): Promise<TodoDeleteResponseGQL> => {
      const todo = await context.dataSources.todoAPI.deleteTodo(args.todoId);
      if (!todo) {
        return {
          success: false,
          message: 'Failed deleting todo',
          sheet: null,
        };
      }
      const { id, title, notebookId } = await context.dataSources.sheetAPI.getSheet(
        args.sheetId
      );
      const todos = await context.dataSources.todoAPI.getTodos(args.sheetId);
      return {
        success: true,
        message: 'Todo deleted',
        sheet: { id, notebookId, title, todos },
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
      const sheets = await context.dataSources.sheetAPI.getSheets(args.notebookId);
      return {
        success: true,
        message: 'Sheet created',
        notebook: { id: args.notebookId, sheets },
      };
    },

    updateSheet: async (_, args, context: Context): Promise<SheetUpdateResponseGQL> => {
      const sheet = await context.dataSources.sheetAPI.updateSheet(
        { title: args.title },
        args.sheetId
      );
      if (!sheet) {
        return {
          success: false,
          message: 'Failed to update sheet',
          sheet: null,
        };
      }
      return {
        success: true,
        message: 'Sheet updated',
        sheet: {
          id: sheet.id,
          notebookId: sheet.notebookId,
          title: sheet.title,
          todos: await context.dataSources.todoAPI.getTodos(sheet.id),
        },
      };
    },

    deleteSheet: async (_, args, context: Context): Promise<SheetDeleteResponseGQL> => {
      const sheet = await context.dataSources.sheetAPI.deleteSheet(args.sheetId);
      if (!sheet) {
        return {
          success: false,
          message: 'Failed to delete sheet',
          notebook: null,
        };
      }
      const sheets = await context.dataSources.sheetAPI.getSheets(args.notebookId);
      return {
        success: true,
        message: 'Sheet deleted',
        notebook: { id: args.notebookId, sheets },
      };
    },

    signin: async (_, args, context: Context): Promise<UserResponseGQL> => {
      try {
        const newUser = await context.dataSources.userAPI.createUser({
          email: args.email,
          username: args.username,
        });
        return {
          success: true,
          message: 'Created',
          user: newUser,
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
        const user = await context.dataSources.userAPI.findUserByEmail(args.email);
        return {
          success: true,
          message: 'Logged',
          user,
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
      const user = {
        id: context.user.id,
        username: context.user.username,
        email: context.user.email,
        token: context.user.token,
        notebook: {
          id: context.user.notebookId,
          sheets: await context.dataSources.sheetAPI.getSheets(context.user.notebookId),
        },
      };

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
  },
};

export default resolvers;
