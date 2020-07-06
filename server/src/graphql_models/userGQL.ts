import { Context } from '..';
import { UserModel } from '../store';
import AvatarGQL from './AvatarGQL';
import CookbookGQL from './cookbookGQL';

class UserGQL {
  id: number;
  username: string;
  email: string;
  token: string;

  constructor(userModel: UserModel) {
    this.id = userModel.id;
    this.username = userModel.username;
    this.email = userModel.email;
    this.token = userModel.token;
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
