import { DataSource, DataSourceConfig } from 'apollo-datasource';
import bcrypt from 'bcrypt';
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
  password: string;
  confirmPassword: string;
}

interface UserLoginCredentials {
  email: string;
  password: string;
}

interface UpdatedUser {
  username: string;
}

class User extends DataSource {
  context: Context;
  regex = new RegExp('^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,12}$');

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

  async login({ email, password }: UserLoginCredentials): Promise<UserModel> {
    if (!email || !isEmail.validate(email)) throw new Error('Invalid email.');

    await db.sync();
    const user = await dbUser.findOne({ where: { email } });
    if (!user) throw new Error('User does not exist.');
    if (!bcrypt.compareSync(password, user.password))
      throw new Error('Password is incorrect');
    return user;
  }

  async createUser({
    email,
    username,
    password,
    confirmPassword,
  }: NewUser): Promise<UserModel> {
    if (!isEmail.validate(email)) throw new Error('Invalid email.');
    if (!this.regex.test(password)) throw new Error('Invalid password');
    if (password !== confirmPassword) throw new Error('Passwords do not match.');

    try {
      const newUser = await dbUser.create({
        email,
        username,
        password: bcrypt.hashSync(password, 10),
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
