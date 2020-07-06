import { gql } from 'apollo-server';
import UserGQL from './graphql_models/userGQL';
import AvatarGQL from './graphql_models/AvatarGQL';
import NotebookGQL from './graphql_models/notebookGQL';
import SheetGQL from './graphql_models/sheetGQL';
import TodoGQL from './graphql_models/todoGQL';

export interface UserResponseGQL {
  success: boolean;
  message: string;
  user: UserGQL;
}

export interface TodoCreateResponseGQL {
  success: boolean;
  message: string;
  sheet: SheetGQL;
}

export interface TodoUpdateResponseGQL {
  success: boolean;
  message: string;
  todo: TodoGQL;
}

export interface TodoDeleteResponseGQL {
  success: boolean;
  message: string;
  sheet: SheetGQL;
}

export interface SheetCreateResponseGQL {
  success: boolean;
  message: string;
  notebook: NotebookGQL;
}

export interface SheetUpdateResponseGQL {
  success: boolean;
  message: string;
  sheet: SheetGQL;
}

export interface SheetDeleteResponseGQL {
  success: boolean;
  message: string;
  notebook: NotebookGQL;
}

export interface AvatarResponseGQL {
  success: boolean;
  message: string;
  user: UserGQL;
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

    uploadAvatar(file: Upload!): AvatarResponseGQL
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

  type AvatarResponseGQL {
    success: Boolean
    message: String
    user: User
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

  type Avatar {
    uri: String
  }

  type User {
    id: ID!
    username: String
    email: String
    token: String
    avatar: Avatar
    notebook: Notebook
  }
`;

export default typeDefs;
