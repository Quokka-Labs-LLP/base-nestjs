import { ConfigService } from '@nestjs/config/dist';
import { NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { HttpExceptionsFilter } from './common/filters/http-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });

  // Getting config service for accessing environment variable
  const configService = app.get(ConfigService);

  // Setting global path starts with : - api/v1
  app.setGlobalPrefix(`api/v${configService.get('API_VERSION').split('.')[0]}`);

  // Set global exception filters
  app.useGlobalFilters(new HttpExceptionsFilter(configService), new AllExceptionsFilter(configService));

  // Set global interceptors
  app.useGlobalInterceptors(new ResponseInterceptor(configService));


  // Listening server on port
  const serverPort = configService.get('SERVER_PORT');
  await app.listen(serverPort, async () => {
    const serverHost = await app.getUrl();
    console.log(`Nest application started successfully`)
    console.info(`Server is running on ${serverHost}/api/v${configService.get('API_VERSION').split('.')[0]}`);
  });
}
bootstrap();
