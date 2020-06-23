import { Context } from '..';
import { UserModel } from '../store';
import AvatarGQL from './AvatarGQL';
import NotebookGQL from './notebookGQL';

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

  async notebook(_args, context: Context): Promise<NotebookGQL> {
    const notebookModel = await context.dataSources.notebookAPI.getNotebook(this.id);
    if (!notebookModel) return null;
    return new NotebookGQL(notebookModel);
  }
}

export default UserGQL;
