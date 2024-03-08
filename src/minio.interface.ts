import { ModuleMetadata, Type } from '@nestjs/common';

export const MINIO_MODULE_OPTIONS = 'MINIO_MODULE_OPTIONS';

export interface MinioModuleOptions {
  endPoint: string;
  accessKey: string;
  secretKey: string;
  port?: number | undefined;
  useSSL?: boolean | undefined;
  defaultBucket?: string | undefined;
}

export interface MinioModuleFactory {
  createModuleOptions: () => Promise<MinioModuleOptions> | MinioModuleOptions;
}

export interface MinioModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<MinioModuleFactory>;
  useExisting?: Type<MinioModuleFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<MinioModuleOptions> | MinioModuleOptions;
}
