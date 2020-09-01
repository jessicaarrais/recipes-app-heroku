import { Sequelize, DataType, Model } from 'sequelize-typescript';
import { BuildOptions } from 'sequelize/types';

export const db = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

/* User Model */
export interface UserModel extends Model {
  id: string;
  username: string;
  email: string;
  password: string;
  cookbookId: string;
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
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
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
  password: {
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  cookbookId: DataType.UUID,
  token: DataType.STRING,
  createdAt: DataType.DATE,
  updatedAt: DataType.DATE,
  deletedAt: DataType.DATE,
});

/* Avatar Model */
export interface AvatarModel extends Model {
  id: string;
  userId: string;
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
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  },
  userId: DataType.UUID,
  filename: DataType.STRING,
  mimetype: DataType.STRING,
  encoding: DataType.STRING,
  createdAt: DataType.DATE,
  updatedAt: DataType.DATE,
  deletedAt: DataType.DATE,
});

/* Cookbook Model */
export interface CookbookModel extends Model {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
export type CookbookStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): CookbookModel;
};
export const dbCookbook = <CookbookStatic>db.define('cookbook', {
  id: {
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  },
  userId: DataType.UUID,
  createdAt: DataType.DATE,
  updatedAt: DataType.DATE,
  deletedAt: DataType.DATE,
});

/* Recipe Model */
export interface RecipeModel extends Model {
  id: string;
  cookbookId: string;
  title: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
export type RecipeStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): RecipeModel;
};
export const dbRecipe = <RecipeStatic>db.define('recipe', {
  id: {
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  },
  cookbookId: DataType.UUID,
  title: DataType.STRING,
  isPublic: { type: DataType.BOOLEAN, defaultValue: false },
  createdAt: DataType.DATE,
  updatedAt: DataType.DATE,
  deletedAt: DataType.DATE,
});

/* Ingredient Model */
export interface IngredientModel extends Model {
  id: string;
  text: string;
  recipeId: string;
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
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  },
  recipeId: DataType.UUID,
  text: DataType.STRING,
  isChecked: DataType.BOOLEAN,
  createdAt: DataType.DATE,
  updatedAt: DataType.DATE,
  deletedAt: DataType.DATE,
});

/* Instruction Model */
export interface InstructionModel extends Model {
  id: string;
  recipeId: string;
  step: string;
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
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  },
  recipeId: DataType.UUID,
  step: DataType.STRING,
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
