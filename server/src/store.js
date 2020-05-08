const SQL = require('sequelize');

const createStore = () => {
  const db = new SQL('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: './database.sqlite',
    operatorAliases: { $in: SQL.Op.in, $or: SQL.Op.or },
    logging: false,
  });

  const user = db.define('user', {
    userId: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    deletedAt: SQL.DATE,
    email: SQL.STRING,
    notebookId: SQL.INTEGER,
    token: SQL.STRING,
  });

  const notebook = db.define('notebook', {
    notebookId: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    deletedAt: SQL.DATE,
    userId: SQL.INTEGER,
  });

  const sheet = db.define('sheet', {
    sheetId: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    deletedAt: SQL.DATE,
    notebookId: SQL.INTEGER,
    title: SQL.STRING,
  });

  const todo = db.define('todo', {
    todoId: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    deletedAt: SQL.DATE,
    sheetId: SQL.INTEGER,
    text: SQL.STRING,
    isChecked: SQL.BOOLEAN,
  });

  user.hasOne(notebook);
  notebook.belongsTo(user, { foreignKey: 'userId', onDelete: 'CASCADE' });
  notebook.hasMany(sheet);
  sheet.belongsTo(notebook, { foreignKey: 'notebookId', onDelete: 'CASCADE' });
  sheet.hasMany(todo);
  todo.belongsTo(sheet, { foreignKey: 'sheetId', onDelete: 'CASCADE' });

  return { user, notebook, sheet, todo, db };
};

module.exports = createStore;
