import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { db, dbNotebook, NotebookModel } from '../store';
import { Context } from '..';

class Notebook extends DataSource {
  context: Context;

  initialize(config: DataSourceConfig<Context>): void | Promise<void> {
    this.context = config.context;
  }

  static async create(userId: number): Promise<NotebookModel> {
    await db.sync();
    return await dbNotebook.create({ userId });
  }

  async getNotebook(userId: number): Promise<NotebookModel> {
    await db.sync();
    return await dbNotebook.findOne({ where: { userId } });
  }
}

export default Notebook;
