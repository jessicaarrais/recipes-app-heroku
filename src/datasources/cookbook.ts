import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { db, dbCookbook, CookbookModel } from '../store';
import { Context } from '..';

class Cookbook extends DataSource {
  context!: Context;

  initialize(config: DataSourceConfig<Context>): void | Promise<void> {
    this.context = config.context;
  }

  static async create(userId: string): Promise<CookbookModel> {
    await db.sync();
    return await dbCookbook.create({ userId });
  }

  async getCookbook(userId: string): Promise<CookbookModel | null> {
    await db.sync();
    return await dbCookbook.findOne({ where: { userId } });
  }
}

export default Cookbook;
