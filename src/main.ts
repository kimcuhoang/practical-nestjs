import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {


  const app = await NestFactory.create(AppModule, {
    abortOnError: true
  });

  const configService = app.get<ConfigService>(ConfigService);

  const logLevels = configService.get("LOG_LEVELS")?.split("|") ?? [ 'error' ];
  app.useLogger(logLevels as LogLevel[]);
  
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true, 
    validationError: { 
      target: true,
      value: true
    }
  }));

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

  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true, 
    validationError: { 
      target: true,
      value: true
    }
  }));
  await app.listen(3000);
}
bootstrap();
