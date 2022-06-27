import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { loggerMiddleware } from './common/middleware/logger.middleware';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './common/modules/database/database.module';
import { PostsModule } from './common/modules/posts/posts.module';

@Module({
  imports: [ 
    ConfigModule.forRoot({
      isGlobal: true,
    validationSchema: Joi.object({
      POSTGRES_HOST: Joi.string().required(),
      POSTGRES_PORT: Joi.number().required(),
      POSTGRES_USER: Joi.string().required(),
      POSTGRES_PASSWORD: Joi.string().required(),
      POSTGRES_DB: Joi.string().required()
    })
  }), DatabaseModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(loggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

