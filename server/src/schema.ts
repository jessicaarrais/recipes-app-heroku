import { gql } from 'apollo-server';

export interface UserGQL {
  id: number;
  email: string;
  token: string;
  notebook: NotebookGQL;
}

export interface NotebookGQL {
  id: number;
  notebook: Array<SheetGQL>;
}

export interface SheetGQL {
  id: number;
  notebookId: number;
  title: string;
  sheet: Array<TodoGQL>;
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

export interface TodoUpdateResponseGQL {
  success: Boolean;
  message: string;
  sheet: Array<TodoGQL>;
}

export interface SheetUpdateResponseGQL {
  success: Boolean;
  message: string;
  notebook: Array<SheetGQL>;
}

const typeDefs = gql`
  type Query {
    user(email: String): User
  }

  type Mutation {
    createTodo(text: String, isChecked: Boolean, sheetId: ID!): TodoUpdateResponse

    updateTodo(
      todoId: ID!
      text: String
      isChecked: Boolean
      sheetId: ID!
    ): TodoUpdateResponse

    deleteTodo(todoId: ID!, sheetId: ID!): TodoUpdateResponse

    createSheet(title: String, notebookId: ID!): SheetUpdateResponse

    updateSheet(sheetId: ID!, title: String, notebookId: ID!): SheetUpdateResponse

    deleteSheet(sheetId: ID!, notebookId: ID!): SheetUpdateResponse

    signin(email: String): UserResponse

    login(email: String): UserResponse

    deleteUser: UserResponse
  }

  type UserResponse {
    success: Boolean
    message: String
    user: User
  }

  type TodoUpdateResponse {
    success: Boolean
    message: String
    sheet: [Todo]
  }

  type SheetUpdateResponse {
    success: Boolean
    message: String
    notebook: [Sheet]
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
    sheet: [Todo]
  }

  type Notebook {
    id: ID!
    notebook: [Sheet]
  }

  type User {
    id: ID!
    email: String
    token: String
    notebook: Notebook
  }
`;

export default typeDefs;
