import { ImageConfiguration } from '@my-old-startup/common/interfaces';
import { injectable }         from 'inversify';
import * as sharp             from 'sharp';

export enum ImageFormat {
  PNG,
  JPG,
}

const JPG_OPTIONS: sharp.JpegOptions = {
  progressive: true,
  quality:     85,
};

export type IImageConvertService = {
  /**
   * Return a normalized image loaded from the input file uri
   */
  resizeImage(
    inputFile: string | Buffer,
    options: ImageConfiguration,
  ): Promise<sharp.Sharp>;

  /**
   * Store a document as png
   * @param inputFilePath
   */
  toPng(inputFilePath: string): NodeJS.ReadableStream;
};

@injectable()
export class ImageConvertService implements IImageConvertService {

  public async resizeImage(
    inputFile: string | Buffer,
    options: ImageConfiguration,
  ): Promise<sharp.Sharp> {
    const image = sharp(inputFile);

    const metadata                  = await image.metadata();
    const { format, width, height } = metadata;
    if (width === options.width && height === options.height && format === 'jpeg') {
      return image;
    }

    return sharp(inputFile)
      .resize(options.width, options.height, {
        withoutEnlargement: true,
        fit:                'cover',
      })
      .flatten({
                 background: {
                   // set white background for every image with transparency
                   r:     255,
                   g:     255,
                   b:     255,
                   alpha: 1,
                 },
               })
      .jpeg(JPG_OPTIONS);
  }

  public toPng(inputFilePath: string): NodeJS.ReadableStream {
    return sharp(inputFilePath).png({ progressive: true });
  }
}
