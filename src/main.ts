import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { QueryFailedExceptionFilter } from './common/filters/dbexception.filter';
import { HttpExceptionFilter } from './common/filters/exception.filter';
import { GlobalExceptionFilter } from './common/filters/globalexception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter(), new QueryFailedExceptionFilter(), new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
