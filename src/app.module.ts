import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { loggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [],
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

