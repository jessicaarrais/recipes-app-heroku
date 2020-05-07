const { DataSource } = require('apollo-datasource');
const isEmail = require('isemail');
const Notebook = require('./notebook');

class User extends DataSource {
  constructor(store) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  async findUserByEmail(email) {
    if (!email || !isEmail.validate(email)) return null;

    await this.store.db.sync();
    const user = await this.store.user.findOne({ where: { email } });

    return user;
  }

  async createUser(email) {
    if (!isEmail.validate(email)) return null;

    await this.store.db.sync();

    const emailExists = this.store.user.findOne({ where: { email } });
    if (emailExists) throw new Error('Email already exists.');

    const newUser = await this.store.user.create({ email });
    const newNotebook = await Notebook.create(this.store, newUser.userId);
    if (newNotebook) {
      await newUser.update({
        notebookId: newNotebook.notebookId,
      });
    }
    return newUser;
  }
}

module.exports = User;
