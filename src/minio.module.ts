import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import {
  MINIO_MODULE_OPTIONS,
  MinioModuleAsyncOptions,
  MinioModuleFactory,
  MinioModuleOptions,
} from './minio.interface';
import { MinioService } from './minio.service';

@Global()
@Module({
  imports: [],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {
  static forRoot(options: MinioModuleOptions): DynamicModule {
    return {
      module: MinioModule,
      imports: [
        MinioModule.forRoot({
          endPoint: options.endPoint,
          port: options.port,
          useSSL: options.useSSL,
          accessKey: options.accessKey,
          secretKey: options.secretKey,
        }),
      ],
    };
  }

  static forRootAsync(options: MinioModuleAsyncOptions): DynamicModule {
    return {
      module: MinioModule,
      imports: [...options.imports],
      providers: [...this.createAsyncProviders(options)],
      exports: [...this.createAsyncProviders(options)],
    };
  }

  private static createAsyncProviders(
    options: MinioModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: MinioModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: MINIO_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: MINIO_MODULE_OPTIONS,
      useFactory: async (optionsFactory: MinioModuleFactory) =>
        await optionsFactory.createModuleOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
