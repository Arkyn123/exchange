import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const documentConfig = new DocumentBuilder().setTitle('Бэкенд биржи с лимитными и маркетными ордерами').build()
  const document = SwaggerModule.createDocument(app, documentConfig)
  SwaggerModule.setup('api', app, document)
  
  await app.listen(9000);
}
bootstrap();
