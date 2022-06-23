import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { QueryFailedExceptionFilter } from './common/filters/dbexception.filter';
import { HttpExceptionFilter } from './common/filters/exception.filter';
import { GlobalExceptionFilter } from './common/filters/globalexception.filter';
import { ApiResponseInterceptor } from './common/interceptor/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter(), new QueryFailedExceptionFilter(), new HttpExceptionFilter());
  app.useGlobalInterceptors(new ApiResponseInterceptor());
  await app.listen(3000);
}
bootstrap();
