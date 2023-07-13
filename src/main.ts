import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AllExceptionsFilter } from '@filters/all-exceptions.filter';
import { HttpExceptionsFilter } from '@filters/http-exceptions.filter';
import { ResponseInterceptor } from '@interceptors/response.interceptor';
import { AppModule } from './modules/app/app.module';
import * as bodyParser from 'body-parser';
import GlobalValidationPipe from '@pipes/global-validation.pipe';

/**
 *
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Enable CORS
  app.enableCors();

  // Getting config service for accessing environment variable
  const configService = app.get(ConfigService);

  // Setting global path starts with : - /api
  app.setGlobalPrefix('api');

  // Enable versioning (eg:- /api/v1, /api/v2)
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: `${configService.get('API_VERSION').split('.')[0]}`,
  });

  // Set global exception filters
  app.useGlobalFilters(
    new HttpExceptionsFilter(configService),
    new AllExceptionsFilter(configService),
  );

  // Set global interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Set global validation pipe
  app.useGlobalPipes(GlobalValidationPipe);

  // Initializing swagger for APIs documentation
  if (
    configService.get('NODE_ENV') !== 'production' &&
    configService.get('NODE_ENV') !== 'prod'
  ) {
    const config = new DocumentBuilder()
      .setTitle(`${configService.get('APP_NAME')}`)
      .setDescription(`The ${configService.get('APP_NAME')} APIs documentation`)
      .setVersion(`${configService.get('API_VERSION')}`)
      .addTag(`${configService.get('APP_NAME')}`)
      .setExternalDoc(
        'Postman Collection',
        `v${configService.get('API_VERSION').split('.')[0]}-json`,
      )
      .build();

    const documentOptions: SwaggerDocumentOptions = {
      /**
       *
       * @param controllerKey Controller name
       * @param methodKey Method name
       * @returns Concatenated contoller name and method name
       */
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        `${controllerKey}@${methodKey}`,
    };

    // Custom styling of swagger UI section
    const styleOptions = {
      customSiteTitle: `${configService.get('APP_NAME')}`,
      customCss: `.topbar-wrapper img {content:url(${configService.get(
        'APP_LOGO',
      )})}`,
      customfavIcon: `${configService.get('APP_FAVICON')}`,
    };

    const document = SwaggerModule.createDocument(app, config, documentOptions);
    SwaggerModule.setup(
      `api/v${configService.get('API_VERSION').split('.')[0]}`,
      app,
      document,
      styleOptions,
    );
  }

  // Listening server on port
  const serverPort = configService.get('SERVER_PORT');
  await app.listen(serverPort, async () => {
    const serverHost = await app.getUrl();
    console.log(`Nest application started successfully`);
    console.info(
      `Server is running on ${serverHost}/api/v${
        configService.get('API_VERSION').split('.')[0]
      }`,
    );
  });
}
bootstrap();
