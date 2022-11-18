import { ConfigService } from '@nestjs/config/dist';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
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
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Initializing swagger for APIs documentation
  if (configService.get('NODE_ENV') !== 'production' && configService.get('NODE_ENV') !== 'prod') {
    const config = new DocumentBuilder()
      .setTitle(`${configService.get('APP_NAME')} APIs`)
      .setDescription(`The ${configService.get('APP_NAME')} API documentation`)
      .setVersion(`${configService.get('API_VERSION')}`)
      .addTag(`${configService.get('APP_NAME')}`)
      .build();

    const options: SwaggerDocumentOptions = {
      operationIdFactory: (
        controllerKey: string,
        methodKey: string
      ) => `${controllerKey}@${methodKey}`
    };

    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup(`api/v${configService.get('API_VERSION').split('.')[0]}`, app, document);
  }


  // Listening server on port
  const serverPort = configService.get('SERVER_PORT');
  await app.listen(serverPort, async () => {
    const serverHost = await app.getUrl();
    console.log(`Nest application started successfully`)
    console.info(`Server is running on ${serverHost}/api/v${configService.get('API_VERSION').split('.')[0]}`);
  });
}
bootstrap();
