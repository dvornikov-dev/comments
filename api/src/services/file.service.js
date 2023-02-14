import * as fs from 'node:fs';
import * as path from 'node:path';
import * as mime from 'mime-types';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

class FileService {
  STATIC_PATH = path.join(process.cwd(), './static/');
  MAX_TEXT_SIZE = 102400;
  MAX_WIDTH = 320;
  MAX_HEIGHT = 240;
  MIME_TYPES = ['text/plain', 'image/png', 'image/gif', 'image/jpeg'];

  async validateFile(file) {
    const mimeType = file.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
    // Проверяем тип файла
    if (!this.MIME_TYPES.includes(mimeType)) {
      return { success: false, message: 'Invalid Extension' };
    }
    const extension = mime.extension(mimeType);

    const fileSize = file.length * 0.75;

    // Проверяем размер файла
    if (fileSize > this.MAX_TEXT_SIZE && mimeType === 'text/plain') {
      return {
        success: false,
        message: 'File is too large',
      };
    }

    const base64WithoutHeader = file.split(',')[1];
    if (mimeType === 'text/plain') {
      return {
        success: true,
        message: 'Success',
        file: base64WithoutHeader,
        extension,
      };
    }

    const image = sharp(Buffer.from(base64WithoutHeader, 'base64'));
    const metadata = await image.metadata();
    const { width, height } = metadata;

    if (width > this.MAX_WIDTH || height > this.MAX_HEIGHT) {
      await image
        .resize({
          width: this.MAX_WIDTH,
          height: this.MAX_HEIGHT,
          fit: 'inside',
        })
        .toBuffer();
    }
    const resizedData = await image.toBuffer();
    return { success: true, message: 'Success', file: resizedData, extension };
  }

  async saveFile(file, extension) {
    return new Promise((resolve, reject) => {
      const buffer = Buffer.from(file, 'base64');

      const fileName = uuidv4();

      fs.writeFile(
        this.STATIC_PATH + fileName + '.' + extension,
        buffer,
        (err) => {
          if (err) reject(err);
          resolve({ fileName, extension });
        },
      );
    });
  }
}

export default FileService;
