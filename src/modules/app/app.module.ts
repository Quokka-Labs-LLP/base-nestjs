import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from '../mail/mail.module';
import { dotenvConfig } from '@config/dotenv.config';
import { DatabaseModule } from '../db/database.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(dotenvConfig()),
    MailModule,
    DatabaseModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
