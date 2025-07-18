import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';

async function bootstrap() {

  initializeTransactionalContext({
    storageDriver: StorageDriver.ASYNC_LOCAL_STORAGE
  });

  const app = await NestFactory.create(AppModule, {
    abortOnError: true,
    bodyParser: true
  });

  const configService = app.get<ConfigService>(ConfigService);

  const logLevels = configService.get("LOG_LEVELS")?.split("|") ?? ['error'];
  app.useLogger(logLevels as LogLevel[]);

  app.useGlobalPipes(new I18nValidationPipe({
    whitelist: false,
    transform: true,
    stopAtFirstError: true,
    always: true,
    transformOptions: {
      enableImplicitConversion: true,
    }
  }));
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: true,
    })
  );

  const options: SwaggerDocumentOptions = {
    deepScanRoutes: true
  };

  const config = new DocumentBuilder()
    .setTitle('Project management')
    .setDescription('The project API description')
    .setVersion('1.0')
    .build();


  const document = SwaggerModule.createDocument(app, config, options);

  SwaggerModule.setup(`swagger`, app, document, {
    explorer: true
  });


  await app.listen(3000);
}
bootstrap();
