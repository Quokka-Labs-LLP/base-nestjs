import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        API_VERSION: Joi.string().default('1.0'),
        SERVER_PORT: Joi.number().default(3000).required()
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
