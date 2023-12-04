import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api/v1');

  // Request Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Helmet
  app.use(helmet());

  // Port
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('port');
  const clientUrl = configService.get('clientUrl');

  // Cors
  app.enableCors({
    origin: clientUrl,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/swagger', app, document);

  // Start server
  await app.listen(port);
}
bootstrap();
