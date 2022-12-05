import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        API_VERSION: Joi.string().required(),
        SERVER_PORT: Joi.number().required()
      }),
      envFilePath: ['.env.local', '.env.development', '.env.production'],
      isGlobal: true,
      cache: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
