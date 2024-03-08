import { MINIO_MODULE_OPTIONS, MinioModuleOptions } from './minio.interface';
import * as Minio from 'minio';

import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DocumentErrors } from './document-messages.enum';
import { BufferedFile } from './document.interface';

@Injectable()
export class MinioService {
  minioClient: Minio.Client;

  constructor(
    @Inject(MINIO_MODULE_OPTIONS)
    private minioModuleOptions: MinioModuleOptions,
  ) {
    if (this.minioModuleOptions.endPoint) {
      this.minioClient = new Minio.Client({
        endPoint: this.minioModuleOptions.endPoint,
        port: this.minioModuleOptions.port,
        useSSL: this.minioModuleOptions.useSSL,
        accessKey: this.minioModuleOptions.accessKey,
        secretKey: this.minioModuleOptions.secretKey,
      });
    }
  }

  async getObject(bucketName: string, fileName: string) {
    const responseDataChunks: Buffer[] = [];
    try {
      const dataStream = await this.minioClient.getObject(bucketName, fileName);

      return await new Promise((resolve) => {
        dataStream.on('error', function (err) {
          throw new Error(err.message);
        });
        dataStream.on('data', function (chunk) {
          responseDataChunks.push(chunk);
        });
        dataStream.on('end', function () {
          resolve(Buffer.concat(responseDataChunks));
        });
      });
    } catch (err) {
      if (err.code === 'NoSuchKey') {
        throw new NotFoundException(DocumentErrors.FILE_NOT_FOUND);
      } else {
        throw new NotFoundException(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async uploadObject(
    file: BufferedFile,
    bucketName: string = this.minioModuleOptions.defaultBucket,
    folder: string,
    userId: number,
  ): Promise<{ url: string }> {
    const metaData = {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Creator': userId,
    };
    const fileName = file.originalname;
    const fileBuffer = file.buffer;
    const fileSize = file.size;

    await this.minioClient.putObject(
      bucketName,
      folder + '/' + fileName,
      fileBuffer,
      fileSize,
      metaData,
    );
    return {
      url: folder + '/' + fileName,
    };
  }

  async makeBucket(bucketsName: string[]) {
    for await (const bucketName of bucketsName) {
      const isExistBucket = await this.minioClient.bucketExists(bucketName);
      if (!isExistBucket) {
        await this.minioClient.makeBucket(bucketName, 'us-east-1');
      }
    }
  }
}
