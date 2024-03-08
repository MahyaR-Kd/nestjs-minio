<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="http://kamilmysliwiec.com/public/nest-logo.png#1" alt="Nest Logo" />   </a>
  <a href="https://min.io" target="_blank"><img src="https://min.io/resources/img/logo.svg" width="380"></a>
</p>

<p align="center">Minio Module for Nest framework</p>


<p align="center">
<a href="https://www.npmjs.com/package/mahyar--kd/nestjs-minio" target="_blank"><img src="https://img.shields.io/npm/v/@mahyar--kd/nestjs-minio" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@mahyar--kd/nestjs-minio" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@mahyar--kd/nestjs-minio" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/MahyaR-Kd/minio-nestjs/master" alt="CircleCI" /></a>

<p align="center">
<a href="https://www.buymeacoffee.com/mahyar.kd"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=mahyar.kd&button_colour=FF5F5F&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00" /></a>

</p>

## Description
This's a [nest-minio](https://github.com/MahyaR-Kd/minio-nestjs) module for [Nest](https://github.com/nestjs/nest).
This quickstart guide will show you how to install the client SDK and execute an example JavaScript program. For a complete list of APIs and examples, please take a look at the [JavaScript Client API Reference](https://docs.min.io/docs/javascript-client-api-reference) documentation.

This document assumes that you have a working [nodejs](http://nodejs.org/) setup in place.


## Installation

```bash
$ npm i --save @mahyar--kd/nestjs-minio
or
$ yarn add @mahyar--kd/nestjs-minio

```


## Initialize MinIO Client

You need five items in order to connect to MinIO object storage server.


| Params     | Description |
| :------- | :------------ |
| endPoint	 | URL to object storage service. |
|port| TCP/IP port number. This input is optional. Default value set to ``80`` for HTTP and ``443`` for HTTPs.|
| accessKey | Access key is like user ID that uniquely identifies your account.   |
| secretKey	| Secret key is the password to your account.    |
|useSSL |Set this value to 'true' to enable secure (HTTPS) access |

Provide the credentials for minio module by importing it as :

```javascript
import { Module } from '@nestjs/common';
import { NestMinioClientController } from './nest-minio-client.controller';
import { MinioModule } from '@mahyar--kd/nestjs-minio';
import { ConfigService } from '@nestjs/config';


@Module({
  controllers: [NestMinioClientController],
  imports: [
    MinioModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        endPoint: configService.get('minio.endpoint'),
        port: configService.get('minio.port'),
        accessKey: configService.get('minio.accessKey'),
        secretKey: configService.get('minio.secretKey'),
        useSSL: configService.get('minio.useSSL'),
        defaultBucket: configService.get('minio.bucket'),
      }),
    }),
  ],
})
export class NestMinioClientModule {}

```
Then you can use it in the service by make instance it in the service as:

```javascript

 constructor(
   private readonly minioService: MinioService,
) {}

```