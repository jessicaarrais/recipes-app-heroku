import { Context } from '..';
import { UserModel } from '../store';
import AvatarGQL from './avatarGQL';
import CookbookGQL from './cookbookGQL';

class UserGQL {
  id: string;
  username: string;
  email: string;

  constructor(userModel: UserModel) {
    this.id = userModel.id;
    this.username = userModel.username;
    this.email = userModel.email;
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
