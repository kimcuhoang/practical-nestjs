import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
