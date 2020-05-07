const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    user(email: String): User
  }

  type Mutation {
    createTodo(
      text: String
      isChecked: Boolean
      sheetId: ID!
    ): TodoUpdateResponse

    updateTodo(
      todoId: ID!
      text: String
      isChecked: Boolean
      sheetId: ID!
    ): TodoUpdateResponse

    deleteTodo(todoId: ID!, sheetId: ID!): TodoUpdateResponse

    createSheet(title: String, notebookId: ID!): SheetUpdateResponse
    updateSheet(
      sheetId: ID!
      title: String
      notebookId: ID!
    ): SheetUpdateResponse

    deleteSheet(sheetId: ID!, notebookId: ID!): SheetUpdateResponse

    signin(email: String): UserResponse

    login(email: String): UserResponse
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
    todoId: ID!
    sheetId: ID!
    text: String
    isChecked: Boolean
  }

  type Sheet {
    sheetId: ID!
    notebookId: ID!
    title: String
    sheet: [Todo]
  }

  type Notebook {
    notebookId: ID!
    notebook: [Sheet]
  }

  type User {
    userId: ID!
    email: String
    auth: String
    notebook: Notebook
  }
`;

module.exports = typeDefs;
