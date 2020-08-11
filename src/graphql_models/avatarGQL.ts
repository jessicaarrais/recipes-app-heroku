import { AvatarModel } from '../store';

class AvatarGQL {
  uri: string;

  constructor(avatarModel: AvatarModel) {
    this.uri = `http://localhost:4000/images/${avatarModel.filename}`;
  }
}

export default AvatarGQL;
