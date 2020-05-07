const { DataSource } = require('apollo-datasource');

class Sheet extends DataSource {
  constructor(store) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  async getSheets(notebookId) {
    return await this.store.sheet
      .findAll({
        where: { notebookId },
      })
      .map(async (sheet) => {
        return {
          ...sheet.dataValues,
          sheet: await this.context.dataSources.todoAPI.getTodos(sheet.sheetId),
        };
      });
  }

  async createSheet({ title, notebookId }) {
    return await this.store.sheet.create({
      title,
      notebookId,
    });
  }

  async updateSheet(updatedSheet, sheetId) {
    return this.store.sheet.update(updatedSheet, { where: { sheetId } });
  }

  async deleteSheet(sheetId) {
    return await this.store.sheet.destroy({ where: { sheetId } });
  }
}

module.exports = Sheet;
