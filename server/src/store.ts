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
  notebookId: number;
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
  notebookId: DataType.INTEGER,
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

/* Notebook Model */
export interface NotebookModel extends Model {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
export type NotebookStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): NotebookModel;
};
export const dbNotebook = <NotebookStatic>db.define('notebook', {
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

/* Sheet Model */
export interface SheetModel extends Model {
  id: number;
  notebookId: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
export type SheetStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): SheetModel;
};
export const dbSheet = <SheetStatic>db.define('sheet', {
  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  notebookId: DataType.INTEGER,
  title: DataType.STRING,
  createdAt: DataType.DATE,
  updatedAt: DataType.DATE,
  deletedAt: DataType.DATE,
});

/* Sheet Model */
export interface TodoModel extends Model {
  id: number;
  text: string;
  isChecked: boolean;
  sheetId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
export type TodoStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): TodoModel;
};
export const dbTodo = <TodoStatic>db.define('todo', {
  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sheetId: DataType.INTEGER,
  text: DataType.STRING,
  isChecked: DataType.BOOLEAN,
  createdAt: DataType.DATE,
  updatedAt: DataType.DATE,
  deletedAt: DataType.DATE,
});

/* Assossiations */
dbUser.hasOne(dbAvatar);
dbAvatar.belongsTo(dbUser, { foreignKey: 'userId', onDelete: 'CASCADE' });
dbUser.hasOne(dbNotebook);
dbNotebook.belongsTo(dbUser, { foreignKey: 'userId', onDelete: 'CASCADE' });
dbNotebook.hasMany(dbSheet);
dbSheet.belongsTo(dbNotebook, {
  foreignKey: 'notebookId',
  onDelete: 'CASCADE',
});
dbSheet.hasMany(dbTodo);
dbTodo.belongsTo(dbSheet, { foreignKey: 'sheetId', onDelete: 'CASCADE' });
