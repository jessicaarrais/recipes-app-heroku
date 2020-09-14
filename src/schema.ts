import { gql } from 'apollo-server';
import UserGQL from './graphql_models/userGQL';
import CookbookGQL from './graphql_models/cookbookGQL';
import RecipeGQL from './graphql_models/recipeGQL';
import IngredientGQL from './graphql_models/ingredientGQL';
import InstructionGQl from './graphql_models/instructionGQL';

export interface AuthResponseGQL {
  success: boolean;
  message: string;
  token: string;
  me: UserGQL;
}

export interface MeResponseGQL {
  success: boolean;
  message: string;
  me: UserGQL;
}

export interface AvatarResponseGQL {
  success: boolean;
  message: string;
  me: UserGQL;
}

export interface FavoriteRecipesResponseGQL {
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
    me: User
    user(username: String, id: ID): User
    recipe(recipeId: ID!, cookbookId: ID!): Recipe
    searchRecipes(value: String): [Recipe]
  }

  type Mutation {
    signup(
      email: String!
      username: String!
      password: String!
      confirmPassword: String!
    ): AuthResponse

    login(email: String!, password: String!): AuthResponse

    updateUser(username: String): MeResponse

    logout: MeResponse

    addRecipeToFavorites(recipeId: ID!): FavoriteRecipesResponse

    removeRecipeFromFavorites(recipeId: ID!): FavoriteRecipesResponse

    deleteUser: MeResponse

    uploadAvatar(file: Upload!): AvatarResponseGQL

    createRecipe: RecipeCreateResponse

    updateRecipe(
      recipeId: ID!
      title: String
      isPublic: Boolean
      cookbookId: ID!
    ): RecipeUpdateResponse

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

  type AuthResponse {
    success: Boolean
    message: String
    token: String
    me: User
  }

  type MeResponse {
    success: Boolean
    message: String
    me: User
  }

  type AvatarResponseGQL {
    success: Boolean
    message: String
    me: User
  }

  type FavoriteRecipesResponse {
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
    avatar: Avatar
    cookbook: Cookbook
    favoriteRecipes: [String]
  }

  type Avatar {
    uri: String
  }

  enum RecipesListOrder {
    DEFAULT
    TITLE_ASCENDING
  }

  type Cookbook {
    id: ID!
    recipes(order: RecipesListOrder): [Recipe]
  }

  type Recipe {
    id: ID!
    owner: User
    cookbookId: ID!
    title: String
    isPublic: Boolean
    isFavorite: Boolean
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
