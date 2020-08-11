import { DataSource, DataSourceConfig } from 'apollo-datasource';
import isEmail from 'isemail';
import { Context } from '..';
import { db, dbUser, UserModel } from '../store';
import Cookbook from './cookbook';

interface CurrentUser {
  username?: string;
}

interface NewUser {
  email: string;
  username: string;
}

interface UpdatedUser {
  username: string;
}

class User extends DataSource {
  context: Context;

  initialize(config: DataSourceConfig<Context>): void | Promise<void> {
    this.context = config.context;
  }

  async getUser({ username }: CurrentUser = {}): Promise<UserModel> {
    await db.sync();
    const user = username
      ? await dbUser.findOne({ where: { username } })
      : this.context.user;
    if (!user) return null;
    return user;
  }

  async findUserByEmail(email: string): Promise<UserModel> {
    if (!email || !isEmail.validate(email)) throw new Error('Invalid email.');
    await db.sync();
    const user = await dbUser.findOne({ where: { email } });
    if (!user) throw new Error('User does not exist.');
    return user;
  }

  async createUser({ email, username }: NewUser): Promise<UserModel> {
    if (!isEmail.validate(email)) throw new Error('Invalid email.');
    await db.sync();
    try {
      const newUser = await dbUser.create({
        email,
        username,
        token: Buffer.from(email).toString('base64'),
      });
      const newCookbook = await Cookbook.create(newUser.id);
      if (newCookbook) {
        await newUser.update({
          cookbookId: newCookbook.id,
        });
      }
      return newUser;
    } catch (error) {
      throw new Error(error.errors[0].message);
    }
  }

  async updateUser(updatedUser: UpdatedUser): Promise<UserModel> {
    await db.sync();
    const user = await dbUser.findOne({ where: { id: this.context.user.id } });
    if (!user) {
      return null;
    }
    try {
      return await user.update(updatedUser);
    } catch (error) {
      throw new Error(error.errors[0].message);
    }
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
