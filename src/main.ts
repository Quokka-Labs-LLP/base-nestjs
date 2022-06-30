import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { QueryFailedExceptionFilter } from './common/filters/dbexception.filter';
import { HttpExceptionFilter } from './common/filters/exception.filter';
import { GlobalExceptionFilter } from './common/filters/globalexception.filter';
import { ApiResponseInterceptor } from './common/interceptor/response.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
  .setTitle('API with NestJS')
  .setDescription('API developed throughout the API with Common-node-ts repo')
  .setVersion('1.0')
  .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new GlobalExceptionFilter(), new QueryFailedExceptionFilter(), new HttpExceptionFilter());
  app.useGlobalInterceptors(new ApiResponseInterceptor());



  await app.listen(3000);
}
bootstrap();
