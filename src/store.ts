import { Sequelize, Model, DataTypes } from 'sequelize';

export const db = process.env.DEV
  ? new Sequelize(process.env.DATABASE_URL)
  : new Sequelize(process.env.DATABASE_URL, {
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
  token: Array<String>;
  favoriteRecipes: Array<String>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export const dbUser = db.define<UserModel>('user', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  cookbookId: DataTypes.UUID,
  token: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  favoriteRecipes: { type: DataTypes.ARRAY(DataTypes.UUID), defaultValue: [] },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  deletedAt: DataTypes.DATE,
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

export const dbAvatar = db.define<AvatarModel>('avatar', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: DataTypes.UUID,
  filename: DataTypes.STRING,
  mimetype: DataTypes.STRING,
  encoding: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  deletedAt: DataTypes.DATE,
});

/* Cookbook Model */
export interface CookbookModel extends Model {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export const dbCookbook = db.define<CookbookModel>('cookbook', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: DataTypes.UUID,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  deletedAt: DataTypes.DATE,
});

/* Recipe Model */
export interface RecipeModel extends Model {
  id: string;
  ownerId: string;
  cookbookId: string;
  title: string;
  isPublic: boolean;
  likes: Array<String>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export const dbRecipe = db.define<RecipeModel>('recipe', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  ownerId: DataTypes.UUID,
  cookbookId: DataTypes.UUID,
  title: DataTypes.STRING,
  isPublic: { type: DataTypes.BOOLEAN, defaultValue: false },
  likes: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  deletedAt: DataTypes.DATE,
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

export const dbIngredient = db.define<IngredientModel>('ingredient', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  recipeId: DataTypes.UUID,
  text: DataTypes.STRING,
  isChecked: DataTypes.BOOLEAN,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  deletedAt: DataTypes.DATE,
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

export const dbInstruction = db.define<InstructionModel>('instruction', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  recipeId: DataTypes.UUID,
  step: DataTypes.STRING,
  text: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  deletedAt: DataTypes.DATE,
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
