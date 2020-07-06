import { NotebookModel } from '../store';
import SheetGQL from './sheetGQL';
import { Context } from '..';

class NotebookGQL {
  id: number;

  constructor(notebookModel: NotebookModel) {
    this.id = notebookModel.id;
  }

  async sheets(_args, context: Context): Promise<Array<SheetGQL>> {
    return (await context.dataSources.sheetAPI.getSheets(this.id)).map(
      (sheetModel) => new SheetGQL(sheetModel)
    );
  }
}

export default NotebookGQL;
