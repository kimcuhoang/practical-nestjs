import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

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

  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(3000);
}
bootstrap();
