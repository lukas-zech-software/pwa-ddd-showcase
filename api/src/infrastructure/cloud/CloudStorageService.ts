import {
  Bucket,
  Storage,
}                           from '@google-cloud/storage';
import { createReadStream } from 'fs';
import {
  inject,
  injectable,
}                           from 'inversify';
import { ICacheService }    from '../../cache/ICacheService';
import { keys }             from '../../container/inversify.keys';

export type ICloudStorageService = {
  storeFileStream(
    filePath: string,
    stream: NodeJS.ReadableStream,
    contentType: string,
  ): Promise<void>;

  storeFile(
    targetFilePath: string,
    sourceFilePath: string,
    contentType: string,
  ): Promise<void>;

  storeSitemap(sitemapContent: string): Promise<void>;

  getImage(imagePath: string): Promise<Buffer>;

  getFilenamesInFolder(folderPath: string, noCache?: boolean): Promise<string[]>;

  getPdf(pdfName: string): Promise<Buffer>;
};

const IMAGE_BUCKET_NAME  = 'images.my-old-startups-domain.de',
      STATIC_BUCKET_NAME = 'static.my-old-startups-domain.de',
      DOCUMENT_PATH      = 'dokumente/';

@injectable()
export class CloudStorageService implements ICloudStorageService {
  private storage: Storage;
  private imageBucket: Bucket;
  private staticBucket: Bucket;

  constructor(
    @inject(keys.GoogleCloudProjectId)
      googleCloudProjectId: string,
    @inject(keys.ICacheService)
      private fileNamesCacheService: ICacheService<string>,
  ) {
    // TODO: Extract to factory
    this.storage      = new Storage({ projectId: googleCloudProjectId });
    this.imageBucket  = this.storage.bucket(IMAGE_BUCKET_NAME);
    this.staticBucket = this.storage.bucket(STATIC_BUCKET_NAME);
  }

  public async storeFile(
    targetFilePath: string,
    sourceFilePath: string,
    contentType: string,
  ): Promise<void> {
    const readStream = createReadStream(sourceFilePath);
    return this.storeFileStream(targetFilePath, readStream, contentType);
  }

  public async storeFileStream(
    fileName: string,
    stream: NodeJS.ReadableStream,
    contentType: string,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const writeStream = this.imageBucket.file(fileName).createWriteStream(
        {
          metadata:  {
            contentType,
            cacheControl: 'public, max-age=31536000',
          },
          gzip:      true,
          resumable: false,
        },
      );

      stream.on('error', (error: any) => {
        reject(error);
      });

      writeStream.on('error', (error: any) => {
        reject(error);
      });

      writeStream.on('finish', () => {
        resolve();
      });

      stream.pipe(writeStream);
    });
  }

  public async storeSitemap(sitemapContent: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const writeStream = this.staticBucket
        .file('meta/sitemap.xml')
        .createWriteStream(
          {
            metadata:  {
              contentType:  'application/xml',
              cacheControl: 'public, max-age=86400',
            },
            gzip:      true,
            resumable: false,
          },
        );

      writeStream.on('error', (error: any) => {
        reject(error);
      });

      writeStream.on('finish', () => {
        resolve();
      });

      writeStream.write(sitemapContent);
      writeStream.end();
    });
  }

  public async getImage(imagePath: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const readStream = this.imageBucket.file(imagePath).createReadStream({ validation: false });

      let resultBuffer = Buffer.from([]);

      readStream.on('error', (error: any) => {
        reject(error);
      });

      readStream.on('data', (data: Buffer) => {
        resultBuffer = Buffer.concat([resultBuffer, data]);
      });

      readStream.on('end', () => {
        resolve(resultBuffer);
      });
    });
  }

  public async getPdf(pdfName: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const readStream = this.staticBucket
        .file(DOCUMENT_PATH + pdfName)
        .createReadStream();

      let resultBuffer = Buffer.from([]);

      readStream.on('error', (error: any) => {
        reject(error);
      });

      readStream.on('data', (data: Buffer) => {
        resultBuffer = Buffer.concat([resultBuffer, data]);
      });

      readStream.on('end', () => {
        resolve(resultBuffer);
      });
    });
  }

  public async getFilenamesInFolder(folderPath: string, noCache?: boolean): Promise<string[]> {

    if (noCache === true) {
      const [result] = await this.imageBucket.getFiles({ prefix: folderPath });

      return result.map((x) => x.name);
    }

    let cached = await this.fileNamesCacheService.get(
      folderPath,
      'BUCKET_FILES',
    );

    if (cached === undefined) {
      const [result] = await this.imageBucket.getFiles({ prefix: folderPath });

      cached = result.map((x) => x.name);

      await this.fileNamesCacheService.set(folderPath, cached, 'BUCKET_FILES');
    }

    return cached;
  }
}
