import { Sequelize, DataType, Model } from 'sequelize-typescript';
import { BuildOptions } from 'sequelize/types';

export const db = new Sequelize('database', 'username', 'password', {
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

/* User Model */
export interface UserModel extends Model {
  id: number;
  username: string;
  email: string;
  cookbookId: number;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
export type UserStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserModel;
};
export const dbUser = <UserStatic>db.define('user', {
  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
  email: {
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
  cookbookId: DataType.INTEGER,
  token: DataType.STRING,
  createdAt: DataType.DATE,
  updatedAt: DataType.DATE,
  deletedAt: DataType.DATE,
});

/* Avatar Model */
export interface AvatarModel extends Model {
  id: number;
  userId: number;
  filename: string;
  mimetype: string;
  encoding: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
export type AvatarStatic = typeof Model & {
  new (values?: object, option?: BuildOptions): AvatarModel;
};
export const dbAvatar = <AvatarStatic>db.define('avatar', {
  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: DataType.INTEGER,
  filename: DataType.STRING,
  mimetype: DataType.STRING,
  encoding: DataType.STRING,
  createdAt: DataType.DATE,
  updatedAt: DataType.DATE,
  deletedAt: DataType.DATE,
});

/* Cookbook Model */
export interface CookbookModel extends Model {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
export type CookbookStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): CookbookModel;
};
export const dbCookbook = <CookbookStatic>db.define('cookbook', {
  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: DataType.INTEGER,
  createdAt: DataType.DATE,
  updatedAt: DataType.DATE,
  deletedAt: DataType.DATE,
});

/* Recipe Model */
export interface RecipeModel extends Model {
  id: number;
  cookbookId: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
export type RecipeStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): RecipeModel;
};
export const dbRecipe = <RecipeStatic>db.define('recipe', {
  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cookbookId: DataType.INTEGER,
  title: DataType.STRING,
  createdAt: DataType.DATE,
  updatedAt: DataType.DATE,
  deletedAt: DataType.DATE,
});

/* Ingredient Model */
export interface IngredientModel extends Model {
  id: number;
  text: string;
  recipeId: number;
  isChecked: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
export type IngredientStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): IngredientModel;
};
export const dbIngredient = <IngredientStatic>db.define('ingredient', {
  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  recipeId: DataType.INTEGER,
  text: DataType.STRING,
  isChecked: DataType.BOOLEAN,
  createdAt: DataType.DATE,
  updatedAt: DataType.DATE,
  deletedAt: DataType.DATE,
});

/* Instruction Model */
export interface InstructionModel extends Model {
  id: number;
  recipeId: number;
  step: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
export type InstructionStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): InstructionModel;
};
export const dbInstruction = <InstructionStatic>db.define('instruction', {
  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  recipeId: DataType.STRING,
  step: DataType.INTEGER,
  text: DataType.STRING,
  createdAt: DataType.DATE,
  updatedAt: DataType.DATE,
  deletedAt: DataType.DATE,
});

/* Assossiations */
dbUser.hasOne(dbAvatar);
dbAvatar.belongsTo(dbUser, { foreignKey: 'userId', onDelete: 'CASCADE' });
dbUser.hasOne(dbCookbook);
dbCookbook.belongsTo(dbUser, { foreignKey: 'userId', onDelete: 'CASCADE' });
dbCookbook.hasMany(dbRecipe);
dbRecipe.belongsTo(dbCookbook, {
  foreignKey: 'cookbookId',
  onDelete: 'CASCADE',
});
dbRecipe.hasMany(dbIngredient);
dbIngredient.belongsTo(dbRecipe, { foreignKey: 'recipeId', onDelete: 'CASCADE' });
dbRecipe.hasMany(dbInstruction);
dbInstruction.belongsTo(dbRecipe, { foreignKey: 'recipeId', onDelete: 'CASCADE' });
