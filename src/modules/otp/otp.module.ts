import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from 'src/common/models/otp.schema';
import { OtpController } from './otp.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
    MailModule,
  ],
  controllers: [OtpController],
  providers: [OtpService],
})
export class OtpModule {}
