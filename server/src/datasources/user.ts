import { DataSource, DataSourceConfig } from 'apollo-datasource';
import isEmail from 'isemail';
import Notebook from './notebook';
import { db, dbUser } from '../store';
import { Context } from '..';
import { UserGQL } from '../schema';

interface NewUser {
  email: string;
  username: string;
}

class User extends DataSource {
  context: Context;

  initialize(config: DataSourceConfig<Context>): void | Promise<void> {
    this.context = config.context;
  }

  async findUserByEmail(email: string): Promise<UserGQL> {
    if (!email || !isEmail.validate(email)) throw new Error('Invalid email.');

    await db.sync();
    const user = await dbUser.findOne({ where: { email } });
    if (!user) throw new Error('User does not exist.');

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      token: user.token,
      notebook: {
        id: user.notebookId,
        sheets: await this.context.dataSources.sheetAPI.getSheets(user.notebookId),
      },
    };
  }

  async createUser({ email, username }: NewUser): Promise<UserGQL> {
    if (!isEmail.validate(email)) throw new Error('Invalid email.');

    await db.sync();
    const emailExists = await dbUser.findOne({ where: { email } });
    const usernameExists = await dbUser.findOne({ where: { username } });
    if (emailExists) throw new Error('Email already exists.');
    if (usernameExists) throw new Error('Username already exists.');

    const newUser = await dbUser.create({
      email,
      username,
      token: Buffer.from(email).toString('base64'),
    });
    const newNotebook = await Notebook.create(newUser.id);
    if (newNotebook) {
      await newUser.update({
        notebookId: newNotebook.id,
      });
    }

    return {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      token: newUser.token,
      notebook: { id: newNotebook.id, sheets: [] },
    };
  }

  async deleteUser(): Promise<boolean> {
    return (
      (await dbUser.destroy({
        where: { id: this.context.user.id },
      })) === 1
    );
  }
}

export default User;
