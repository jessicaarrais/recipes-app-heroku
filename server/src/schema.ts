import { gql } from 'apollo-server';
import UserGQL from './graphql_models/userGQL';
import CookbookGQL from './graphql_models/cookbookGQL';
import RecipeGQL from './graphql_models/recipeGQL';
import IngredientGQL from './graphql_models/ingredientGQL';
import InstructionGQl from './graphql_models/instructionGQL';

export interface UserResponseGQL {
  success: boolean;
  message: string;
  user: UserGQL;
}

export interface AvatarResponseGQL {
  success: boolean;
  message: string;
  user: UserGQL;
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

export interface InstructionCreateResponseGQL {
  success: boolean;
  message: string;
  recipe: RecipeGQL;
}

export interface InstructionUpdateResponseGQL {
  success: boolean;
  message: string;
  instruction: InstructionGQl;
}

export interface InstructionDeleteResponseGQL {
  success: boolean;
  message: string;
  recipe: RecipeGQL;
}

const typeDefs = gql`
  type Query {
    user(email: String): User
  }

  type Mutation {
    signin(email: String!, username: String!): UserResponse

    login(email: String): UserResponse

    updateUser(username: String): UserResponse

    deleteUser: UserResponse

    uploadAvatar(file: Upload!): AvatarResponseGQL

    createRecipe(title: String, cookbookId: ID!): RecipeCreateResponse

    updateRecipe(recipeId: ID!, title: String, cookbookId: ID!): RecipeUpdateResponse

    deleteRecipe(recipeId: ID!, cookbookId: ID!): RecipeDeleteResponse

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

    createInstruction(
      step: String
      text: String
      recipeId: ID!
    ): InstructionCreateResponse

    updateInstruction(
      instructionId: ID!
      step: String
      text: String
      recipeId: ID!
    ): InstructionUpdateResponse

    deleteInstruction(instructionId: ID!, recipeId: ID!): InstructionDeleteResponse
  }

  type UserResponse {
    success: Boolean
    message: String
    user: User
  }

  type AvatarResponseGQL {
    success: Boolean
    message: String
    user: User
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

  type InstructionCreateResponse {
    success: Boolean
    message: String
    recipe: Recipe
  }

  type InstructionUpdateResponse {
    success: Boolean
    message: String
    instruction: Instruction
  }

  type InstructionDeleteResponse {
    success: Boolean
    message: String
    recipe: Recipe
  }

  type User {
    id: ID!
    username: String
    email: String
    token: String
    avatar: Avatar
    cookbook: Cookbook
  }

  type Avatar {
    uri: String
  }

  type Cookbook {
    id: ID!
    recipes: [Recipe]
  }

  type Recipe {
    id: ID!
    cookbookId: ID!
    title: String
    ingredients: [Ingredient]
    instructions: [Instruction]
  }

  type Ingredient {
    id: ID!
    recipeId: ID!
    text: String
    isChecked: Boolean
  }

  type Instruction {
    id: ID!
    recipeId: ID!
    step: String
    text: String
  }
`;

export default typeDefs;
