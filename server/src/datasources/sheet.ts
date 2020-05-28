import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { dbSheet, SheetModel } from '../store';
import { Context } from '..';
import { SheetGQL } from '../schema';

interface NewSheet {
  title: string;
  notebookId: number;
}

interface UpdatedSheet {
  title: string;
}

class Sheet extends DataSource {
  context: Context;

  initialize(config: DataSourceConfig<Context>): void | Promise<void> {
    this.context = config.context;
  }

  async getSheet(sheetId: number): Promise<SheetModel> {
    return await dbSheet.findOne({ where: { id: sheetId } });
  }

  async getSheets(notebookId: number): Promise<Array<SheetGQL>> {
    return await dbSheet
      .findAll({
        where: { notebookId },
      })
      .map(async (sheet) => {
        return {
          id: sheet.id,
          notebookId: sheet.notebookId,
          title: sheet.title,
          todos: await this.context.dataSources.todoAPI.getTodos(sheet.id),
        };
      });
  }

  async createSheet({ title, notebookId }: NewSheet): Promise<SheetModel> {
    return await dbSheet.create({
      title,
      notebookId,
    });
  }

  async updateSheet(updatedSheet: UpdatedSheet, sheetId: number): Promise<SheetModel> {
    const sheet = await dbSheet.findOne({ where: { id: sheetId } });
    if (!sheet) {
      return null;
    }
    return await sheet.update(updatedSheet);
  }

  async deleteSheet(sheetId: number): Promise<boolean> {
    return (await dbSheet.destroy({ where: { id: sheetId } })) === 1;
  }
}

export default Sheet;
