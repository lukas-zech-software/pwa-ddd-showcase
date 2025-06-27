import { DEAL_IMAGE_CONFIG }                   from '@my-old-startup/common/interfaces';
import * as fs                                 from 'fs';
import { resolve }                             from 'path';
import * as sharp                              from 'sharp';
import { FileResult, fileSync as tmpFileSync } from 'tmp';
import { container }                           from '../../container/inversify.config';
import { keys }                                from '../../container/inversify.keys';
import { ImageConvertService }                 from './ImageConvertService';

describe('ImageConvertService', () => {
  let imageConvertService: ImageConvertService,
      tmpFile: FileResult;

  beforeEach(() => {
    imageConvertService = container.get(keys.IImageConvertService);
    tmpFile = tmpFileSync();
  });

  afterEach(() => {
    tmpFile.removeCallback();
  });

  describe('resizeImage', () => {
    it('should return the same image bytes it was input if no resize or conversion occurred', async () => {
      const imagePath = resolve(__dirname, '../../../test/resources/images/correct-750x325.jpg');
      const existingImageData = await sharp(imagePath).toBuffer();

      const convertedImage = await imageConvertService.resizeImage(imagePath, DEAL_IMAGE_CONFIG);
      const convertedImageData = await convertedImage.toBuffer();

      expect(existingImageData).toEqual(convertedImageData);
    });

    it('should reduce the size of a larger image', async () => {
      const imagePath = resolve(__dirname, '../../../test/resources/images/blank-1000x1000.jpg');
      const resizedData = await imageConvertService.resizeImage(imagePath, DEAL_IMAGE_CONFIG);

      fs.write(tmpFile.fd, resizedData, (err) => {
        if (err) {
          throw err;
        }

        const resizedImage = sharp(tmpFile.name);

        resizedImage.metadata()
          .then((metadata) => {
            expect(metadata.width).toEqual(DEAL_IMAGE_CONFIG.width);
            expect(metadata.height).toEqual(DEAL_IMAGE_CONFIG.height);
          });
      });
    });

    it('should convert PNG', async () => {
      const imagePath = resolve(__dirname, '../../../test/resources/images/blank-1000x1000.png');
      const convertedData = await imageConvertService.resizeImage(imagePath, DEAL_IMAGE_CONFIG);

      fs.write(tmpFile.fd, convertedData, (err) => {
        if (err) {
          throw err;
        }

        const convertedImage = sharp(tmpFile.name);

        convertedImage.metadata()
          .then((metadata) => {
            expect(metadata.width).toEqual(DEAL_IMAGE_CONFIG.width);
            expect(metadata.height).toEqual(DEAL_IMAGE_CONFIG.height);
            expect(metadata.format).toEqual('jpeg');
          });
      });
    });

    it('should convert SVG', async () => {
      const imagePath = resolve(__dirname, '../../../test/resources/images/circle-1000x1000.svg');
      const convertedData = await imageConvertService.resizeImage(imagePath, DEAL_IMAGE_CONFIG);

      fs.write(tmpFile.fd, convertedData, (err) => {
        if (err) {
          throw err;
        }

        const convertedImage = sharp(tmpFile.name);

        convertedImage.metadata()
          .then((metadata) => {
            expect(metadata.width).toEqual(DEAL_IMAGE_CONFIG.width);
            expect(metadata.height).toEqual(DEAL_IMAGE_CONFIG.height);
            expect(metadata.format).toEqual('jpeg');
          });
      });
    });
  });
});
