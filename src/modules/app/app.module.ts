import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from '../mail/mail.module';
import { dotenvConfig } from '@config/dotenv.config';

@Module({
  imports: [ConfigModule.forRoot(dotenvConfig()), MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
