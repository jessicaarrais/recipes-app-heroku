import { AvatarModel } from '../store';

class AvatarGQL {
  uri: string;

  constructor(avatarModel: AvatarModel) {
    this.uri = `https://rocky-oasis-65465.herokuapp.com/images/${avatarModel.filename}`;
  }
}

export default AvatarGQL;
