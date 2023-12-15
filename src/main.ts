import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import * as requestIp from 'request-ip';
import cookieParser from 'cookie-parser';

import { ValidationPipe } from '@nestjs/common';
import { CorsConfig, NestConfig } from './config/configuration.interface';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configs
  const configService = app.get<ConfigService>(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');

  if (corsConfig?.enabled) {
    app.enableCors({
      origin: corsConfig.allowedOrigin,
      credentials: true,
    });
  }

  app.use(cookieParser());

  // Request Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Enable shutdown hook
  app.enableShutdownHooks();

  // Security
  app.use(
    helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }),
  );

  app.use(requestIp.mw());

  // Start server
  await app.listen(process.env.PORT || nestConfig?.port || 8080);
}
bootstrap();
