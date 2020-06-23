import { SheetModel } from '../store';
import { Context } from '..';
import TodoGQL from './todoGQL';

class SheetGQL {
  id: number;
  notebookId: number;
  title: string;

  constructor(sheetModel: SheetModel) {
    this.id = sheetModel.id;
    this.notebookId = sheetModel.notebookId;
    this.title = sheetModel.title;
  }

  async todos(_args, context: Context): Promise<Array<TodoGQL>> {
    return (await context.dataSources.todoAPI.getTodos(this.id)).map(
      (todoModel) => new TodoGQL(todoModel)
    );
  }
}

export default SheetGQL;
