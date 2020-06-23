import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { dbTodo, TodoModel, db } from '../store';
import { Context } from '..';

interface NewTodo {
  text: string;
  isChecked: boolean;
  sheetId: number;
}

interface UpdatedTodo {
  text: string;
  isChecked: boolean;
}

class Todo extends DataSource {
  context: Context;

  initialize(config: DataSourceConfig<Context>): void | Promise<void> {
    this.context = config.context;
  }

  async getTodos(sheetId: number): Promise<Array<TodoModel>> {
    return await dbTodo.findAll({
      where: { sheetId },
    });
  }

  async createTodo({ text, isChecked, sheetId }: NewTodo): Promise<TodoModel> {
    return await dbTodo.create({ text, isChecked, sheetId });
  }

  async updateTodo(updatedTodo: UpdatedTodo, todoId: number): Promise<TodoModel> {
    const todo = await dbTodo.findOne({ where: { id: todoId } });
    if (!todo) {
      return null;
    }
    return await todo.update(updatedTodo);
  }

  async deleteTodo(todoId: number): Promise<boolean> {
    return (await dbTodo.destroy({ where: { id: todoId } })) === 1;
  }
}

export default Todo;
