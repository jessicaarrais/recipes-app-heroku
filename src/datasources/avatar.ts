import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { createWriteStream, unlink, existsSync, mkdirSync } from 'fs';
import sharp from 'sharp';
import path from 'path';
import { Context } from '..';
import { dbAvatar, db, AvatarModel } from '../store';

class Avatar extends DataSource {
  context: Context;

  initialize(config: DataSourceConfig<Context>): void | Promise<void> {
    this.context = config.context;
  }

  async uploadAvatar({ file }): Promise<AvatarModel> {
    await db.sync();
    try {
      const { filename, mimetype, encoding, createReadStream } = await file;
      const avatar = await dbAvatar.findOrCreate({
        where: { userId: this.context.user.id },
      });
      const newAvatar = avatar[0];
      if (newAvatar) {
        await newAvatar.update({
          filename,
          mimetype,
          encoding,
        });
      }

      existsSync(path.join(__dirname, '../../images')) ||
        mkdirSync(path.join(__dirname, '../../images'));

      const stream = createReadStream();
      const imgPath = path.join(__dirname, '../../images', filename);

      const transform = sharp();
      transform.resize(150, 150, { fit: 'cover' });

      await new Promise((resolve, reject) => {
        const writeStream = createWriteStream(imgPath);
        writeStream.on('finish', resolve);
        writeStream.on('error', (error) => {
          unlink(imgPath, () => {
            reject(error);
          });
        });
        stream.on('error', (error) => writeStream.destroy(error));
        stream.pipe(transform).pipe(writeStream);
      });

      return newAvatar;
    } catch (error) {
      throw new Error(error.errors[0].message);
    }
  }

  async getAvatar(userId: number): Promise<AvatarModel> {
    await db.sync();
    return await dbAvatar.findOne({ where: { userId } });
  }
}

export default Avatar;
