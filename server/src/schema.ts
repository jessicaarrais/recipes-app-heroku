import { gql } from 'apollo-server';
import UserGQL from './graphql_models/userGQL';
import CookbookGQL from './graphql_models/cookbookGQL';
import RecipeGQL from './graphql_models/recipeGQL';
import IngredientGQL from './graphql_models/ingredientGQL';

export interface UserResponseGQL {
  success: boolean;
  message: string;
  user: UserGQL;
}

export interface IngredientCreateResponseGQL {
  success: boolean;
  message: string;
  recipe: RecipeGQL;
}

export interface IngredientUpdateResponseGQL {
  success: boolean;
  message: string;
  ingredient: IngredientGQL;
}

export interface IngredientDeleteResponseGQL {
  success: boolean;
  message: string;
  recipe: RecipeGQL;
}

export interface RecipeCreateResponseGQL {
  success: boolean;
  message: string;
  cookbook: CookbookGQL;
}

export interface RecipeUpdateResponseGQL {
  success: boolean;
  message: string;
  recipe: RecipeGQL;
}

export interface RecipeDeleteResponseGQL {
  success: boolean;
  message: string;
  cookbook: CookbookGQL;
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
    createIngredient(
      text: String
      isChecked: Boolean
      recipeId: ID!
    ): IngredientCreateResponse

    updateIngredient(
      ingredientId: ID!
      text: String
      isChecked: Boolean
      recipeId: ID!
    ): IngredientUpdateResponse

    deleteIngredient(ingredientId: ID!, recipeId: ID!): IngredientDeleteResponse

    createRecipe(title: String, cookbookId: ID!): RecipeCreateResponse

    updateRecipe(recipeId: ID!, title: String, cookbookId: ID!): RecipeUpdateResponse

    deleteRecipe(recipeId: ID!, cookbookId: ID!): RecipeDeleteResponse

    signin(email: String!, username: String!): UserResponse

    login(email: String): UserResponse

    updateUser(username: String): UserResponse

    deleteUser: UserResponse

    uploadAvatar(file: Upload!): AvatarResponseGQL
  }

  type IngredientCreateResponse {
    success: Boolean
    message: String
    recipe: Recipe
  }

  type IngredientUpdateResponse {
    success: Boolean
    message: String
    ingredient: Ingredient
  }

  type IngredientDeleteResponse {
    success: Boolean
    message: String
    recipe: Recipe
  }

  type RecipeCreateResponse {
    success: Boolean
    message: String
    cookbook: Cookbook
  }

  type RecipeUpdateResponse {
    success: Boolean
    message: String
    recipe: Recipe
  }

  type RecipeDeleteResponse {
    success: Boolean
    message: String
    cookbook: Cookbook
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

  type Ingredient {
    id: ID!
    recipeId: ID!
    text: String
    isChecked: Boolean
  }

  type Recipe {
    id: ID!
    cookbookId: ID!
    title: String
    ingredients: [Ingredient]
  }

  type Cookbook {
    id: ID!
    recipes: [Recipe]
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
    cookbook: Cookbook
  }
`;

export default typeDefs;
