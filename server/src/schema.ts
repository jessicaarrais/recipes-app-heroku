import { gql } from 'apollo-server';

export interface UserGQL {
  id: number;
  username: string;
  email: string;
  token: string;
  notebook: NotebookGQL;
}

export interface NotebookGQL {
  id: number;
  sheets: Array<SheetGQL>;
}

export interface SheetGQL {
  id: number;
  notebookId: number;
  title: string;
  todos: Array<TodoGQL>;
}

export interface TodoGQL {
  id: number;
  sheetId: number;
  text: string;
  isChecked: boolean;
}

export interface UserResponseGQL {
  success: boolean;
  message: string;
  user: UserGQL;
}

export interface TodoCreateResponseGQL {
  success: Boolean;
  message: string;
  sheet: SheetGQL;
}

export interface TodoUpdateResponseGQL {
  success: Boolean;
  message: string;
  todo: TodoGQL;
}

export interface TodoDeleteResponseGQL {
  success: Boolean;
  message: string;
  sheet: SheetGQL;
}

export interface SheetCreateResponseGQL {
  success: Boolean;
  message: string;
  notebook: NotebookGQL;
}

export interface SheetUpdateResponseGQL {
  success: Boolean;
  message: string;
  sheet: SheetGQL;
}

export interface SheetDeleteResponseGQL {
  success: Boolean;
  message: string;
  notebook: NotebookGQL;
}

const typeDefs = gql`
  type Query {
    user(email: String): User
  }

  type Mutation {
    createTodo(text: String, isChecked: Boolean, sheetId: ID!): TodoCreateResponse

    updateTodo(
      todoId: ID!
      text: String
      isChecked: Boolean
      sheetId: ID!
    ): TodoUpdateResponse

    deleteTodo(todoId: ID!, sheetId: ID!): TodoDeleteResponse

    createSheet(title: String, notebookId: ID!): SheetCreateResponse

    updateSheet(sheetId: ID!, title: String, notebookId: ID!): SheetUpdateResponse

    deleteSheet(sheetId: ID!, notebookId: ID!): SheetDeleteResponse

    signin(email: String!, username: String!): UserResponse

    login(email: String): UserResponse

    updateUser(username: String): UserResponse

    deleteUser: UserResponse
  }

  type TodoCreateResponse {
    success: Boolean
    message: String
    sheet: Sheet
  }

  type TodoUpdateResponse {
    success: Boolean
    message: String
    todo: Todo
  }

  type TodoDeleteResponse {
    success: Boolean
    message: String
    sheet: Sheet
  }

  type SheetCreateResponse {
    success: Boolean
    message: String
    notebook: Notebook
  }

  type SheetUpdateResponse {
    success: Boolean
    message: String
    sheet: Sheet
  }

  type SheetDeleteResponse {
    success: Boolean
    message: String
    notebook: Notebook
  }

  type UserResponse {
    success: Boolean
    message: String
    user: User
  }

  type Todo {
    id: ID!
    sheetId: ID!
    text: String
    isChecked: Boolean
  }

  type Sheet {
    id: ID!
    notebookId: ID!
    title: String
    todos: [Todo]
  }

  type Notebook {
    id: ID!
    sheets: [Sheet]
  }

  type User {
    id: ID!
    username: String
    email: String
    token: String
    notebook: Notebook
  }
`;

export default typeDefs;
