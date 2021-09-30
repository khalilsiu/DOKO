// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import './libs/moralis';
import { NestFactory } from '@nestjs/core';
import * as cors from 'cors';
import * as express from 'express';
import { AppModule } from './app.module';
import { connectDB } from './db';

async function bootstrap() {
  await connectDB();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  await app.listen(+process.env.PORT || 3000);
}
bootstrap();
