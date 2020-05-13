import { db, dbNotebook, NotebookModel } from '../store';

class Notebook {
  static async create(userId: number): Promise<NotebookModel> {
    await db.sync();
    return await dbNotebook.create({ userId });
  }
}

export default Notebook;
