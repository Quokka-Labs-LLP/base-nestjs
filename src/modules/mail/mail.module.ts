import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { mailConfig } from '@config/mail.config';
import { ConfigService } from '@nestjs/config';

/**
 *
 */
@Module({
  imports: [
    MailerModule.forRootAsync({
      /**
       *
       * @param configService Need to pass config service to mailConfig method to configure mailer options
       * @returns Mail configurations
       */
      useFactory: async (configService: ConfigService) =>
        mailConfig(configService),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
