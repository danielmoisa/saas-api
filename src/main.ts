import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import * as requestIp from 'request-ip';
import cookieParser from 'cookie-parser';

import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    allowedHeaders: '*',
    origin: process.env.CLIENT_URL,
  });

  app.use(cookieParser());

  // Request Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Security
  app.use(
    helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }),
  );

  app.use(requestIp.mw());

  // Port
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.getOrThrow('port');

  // Start server
  await app.listen(port);
}
bootstrap();
