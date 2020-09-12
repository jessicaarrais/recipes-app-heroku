import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';
import isEmail from 'isemail';
import jwt from 'jsonwebtoken';
import { Context } from '..';
import { db, dbUser, UserModel } from '../store';
import Cookbook from './cookbook';

interface GetUserParams {
  username?: string;
  id?: string;
}

interface CreateUserParams {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface LoginParams {
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

  async getUser({ username, id }: GetUserParams): Promise<UserModel> {
    await db.sync();
    if (username) {
      return await dbUser.findOne({ where: { username } });
    }
    if (id && { id }) {
      return await dbUser.findOne({ where: { id } });
    }
    return null;
  }

  async login({
    email,
    password,
  }: LoginParams): Promise<{ userModel: UserModel; token: string }> {
    if (!email || !isEmail.validate(email)) throw new Error('Invalid email.');
    await db.sync();
    const user = await dbUser.findOne({ where: { email } });
    if (!user) throw new Error('User does not exist.');
    if (!bcrypt.compareSync(password, user.password))
      throw new Error('Password is incorrect');
    const newToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    await user.update({
      token: Sequelize.fn('array_append', Sequelize.col('token'), newToken),
    });
    return { userModel: user, token: newToken };
  }

  async createUser({
    email,
    username,
    password,
    confirmPassword,
  }: CreateUserParams): Promise<{ userModel: UserModel; token: string }> {
    if (!isEmail.validate(email)) throw new Error('Invalid email.');
    if (!this.regex.test(password)) throw new Error('Invalid password');
    if (password !== confirmPassword) throw new Error('Passwords do not match.');

    await db.sync();
    try {
      const newUser = await dbUser.create({
        email,
        username,
        password: bcrypt.hashSync(password, 10),
      });
      const newCookbook = await Cookbook.create(newUser.id);
      await newUser.update({
        cookbookId: newCookbook.id,
      });
      const newToken = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);
      await newUser.update({
        token: Sequelize.fn('array_append', Sequelize.col('token'), newToken),
      });
      return { userModel: newUser, token: newToken };
    } catch (error) {
      throw new Error(error.errors[0].message);
    }
  }

  async updateUser(updatedUser: UpdatedUser): Promise<UserModel> {
    await db.sync();
    try {
      return await this.context.user.update(updatedUser);
    } catch (error) {
      throw new Error(error.errors[0].message);
    }
  }

  async logout(): Promise<UserModel> {
    await db.sync();
    return await this.context.user.update({
      token: Sequelize.fn('array_remove', Sequelize.col('token'), this.context.token),
    });
  }

  async addRecipeToFavorites(recipeId: string): Promise<UserModel> {
    await db.sync();
    await this.context.user.update({
      favoriteRecipes: Sequelize.fn(
        'array_append',
        Sequelize.col('favoriteRecipes'),
        recipeId
      ),
    });
    return await this.context.user.reload();
  }

  async removeRecipeFromFavorites(recipeId: string): Promise<UserModel> {
    await db.sync();
    await this.context.user.update({
      favoriteRecipes: Sequelize.fn(
        'array_remove',
        Sequelize.col('favoriteRecipes'),
        recipeId
      ),
    });
    return await this.context.user.reload();
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
