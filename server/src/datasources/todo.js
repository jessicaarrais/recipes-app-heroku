const { DataSource } = require('apollo-datasource');

class Todo extends DataSource {
  constructor(store) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  async getTodos(sheetId) {
    return await this.store.todo
      .findAll({
        where: { sheetId },
      })
      .map((todo) => ({
        ...todo.dataValues,
      }));
  }

  async createTodo({ text, isChecked, sheetId }) {
    return await this.store.todo.create({ text, isChecked, sheetId });
  }

  async updateTodo(updatedTodo, todoId) {
    return await this.store.todo.update(updatedTodo, {
      where: { todoId },
    });
  }

  async deleteTodo(todoId) {
    return this.store.todo.destroy({ where: { todoId } });
  }
}

module.exports = Todo;
