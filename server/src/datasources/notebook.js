class Notebook {
  static async create(store, userId) {
    await store.db.sync();
    return await store.notebook.create({ userId });
  }
}

module.exports = Notebook;
