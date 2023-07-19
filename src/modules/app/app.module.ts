import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from '../mail/mail.module';
import { dotenvConfig } from '@config/dotenv.config';
import { DatabaseConnectModule } from '../../common/db/database-connect.module';
import { PaymentModule } from '../payment/payment.module';

/**
 *
 */
@Module({
  imports: [
    ConfigModule.forRoot(dotenvConfig()),
    MailModule,
    DatabaseConnectModule.forRoot(),
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
