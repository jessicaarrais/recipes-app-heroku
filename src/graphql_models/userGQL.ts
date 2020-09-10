import { Context } from '..';
import { UserModel } from '../store';
import AvatarGQL from './avatarGQL';
import CookbookGQL from './cookbookGQL';

class UserGQL {
  id: string;
  username: string;
  _email: string;
  _favoriteRecipes: Array<String>;

  constructor(userModel: UserModel) {
    this.id = userModel.id;
    this.username = userModel.username;
    this._email = userModel.email;
    this._favoriteRecipes = userModel.favoriteRecipes;
  }

  email(_args, context: Context): string {
    return this.id === context.user.id ? this._email : null;
  }

  favoriteRecipes(_args, context: Context): Array<String> {
    return this.id === context.user.id ? this._favoriteRecipes : [];
  }

  async avatar(_args, context: Context): Promise<AvatarGQL> {
    const avatarModel = await context.dataSources.avatarAPI.getAvatar(this.id);
    if (!avatarModel) return null;
    return new AvatarGQL(avatarModel);
  }

  async cookbook(_args, context: Context): Promise<CookbookGQL> {
    const cookbookModel = await context.dataSources.cookbookAPI.getCookbook(this.id);
    if (!cookbookModel) return null;
    return new CookbookGQL(cookbookModel);
  }
}

export default UserGQL;
