const resolvers = {
  Query: {
    user: async (_, __, context) => await context.user,
  },

  Mutation: {
    createTodo: async (_, args, context) => {
      const sheet = await context.dataSources.todoAPI.getTodos(args.sheetId);
      const response = await context.dataSources.todoAPI.createTodo({
        text: args.text,
        isChecked: args.isChecked,
        sheetId: args.sheetId,
      });
      if (!response) {
        return {
          success: false,
          message: 'Failed creating todo',
        };
      }
      sheet.push(response);

      return { success: true, message: 'Todo created', sheet };
    },

    updateTodo: async (_, args, context) => {
      const todo = await context.dataSources.todoAPI.updateTodo(
        { text: args.text, isChecked: args.isChecked },
        args.todoId
      );
      if (!todo) {
        return {
          success: false,
          message: 'Failed updating todo',
        };
      }
      const sheet = await context.dataSources.todoAPI.getTodos(args.sheetId);

      return { success: true, message: 'Todo updated', sheet };
    },

    deleteTodo: async (_, args, context) => {
      const todo = await context.dataSources.todoAPI.deleteTodo(args.todoId);
      if (!todo) {
        return {
          success: false,
          message: 'Failed deleting todo',
        };
      }
      const sheet = await context.dataSources.todoAPI.getTodos(args.sheetId);

      return { success: true, message: 'Todo deleted', sheet };
    },

    createSheet: async (_, args, context) => {
      const notebook = await context.dataSources.sheetAPI.getSheets(
        args.notebookId
      );

      const sheet = await context.dataSources.sheetAPI.createSheet({
        title: args.title,
        notebookId: args.notebookId,
      });
      if (!sheet) {
        return {
          success: false,
          message: 'Failed creating sheet',
        };
      }
      notebook.push(sheet);

      return { success: true, message: 'Sheet created', notebook };
    },

    updateSheet: async (_, args, context) => {
      const sheet = await context.dataSources.sheetAPI.updateSheet(
        { title: args.title },
        args.sheetId
      );
      if (!sheet) {
        return {
          success: false,
          message: 'Failed to update sheet',
        };
      }
      const notebook = await context.dataSources.sheetAPI.getSheets(
        args.notebookId
      );

      return { success: true, message: 'Sheet updated', notebook };
    },

    deleteSheet: async (_, args, context) => {
      const sheet = await context.dataSources.sheetAPI.deleteSheet(
        args.sheetId
      );
      if (!sheet) {
        return {
          success: false,
          message: 'Failed to delete sheet',
        };
      }
      const notebook = await context.dataSources.sheetAPI.getSheets(
        args.notebookId
      );

      return { success: true, message: 'Sheet deleted', notebook };
    },

    signin: async (_, args, context) => {
      try {
        const newUser = await context.dataSources.userAPI.createUser(
          args.email
        );
        return {
          success: true,
          message: 'Created',
          user: {
            userId: newUser.userId,
            notebookId: newUser.notebookId,
            email: newUser.email,
            auth: Buffer.from(args.email).toString('base64'),
          },
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },

    login: async (_, args, context) => {
      const user = await context.dataSources.userAPI.findUserByEmail(
        args.email
      );
      if (!user) {
        return {
          success: false,
          message: 'Failed logging in',
        };
      }
      return {
        success: true,
        message: 'Logged',
        user: {
          userId: user.userId,
          notebookId: user.notebookId,
          email: user.email,
          auth: Buffer.from(args.email).toString('base64'),
        },
      };
    },

    deleteUser: async (_, __, context) => {
      const user = Object.assign({}, context.user);
      const deletedUser = await context.dataSources.userAPI.deleteUser();
      if (!deletedUser) {
        return {
          success: false,
          message: 'User not deleted',
        };
      }

      return { success: true, message: 'User deleted', user };
    },
  },

  User: {
    notebook: async (user, __, context) => {
      return {
        notebookId: user.notebookId,
        notebook: context.dataSources.sheetAPI.getSheets(user.notebookId),
      };
    },
  },
};

module.exports = resolvers;
