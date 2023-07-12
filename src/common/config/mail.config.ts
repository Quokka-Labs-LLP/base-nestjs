import * as AWS from 'aws-sdk';
import * as path from 'path';
import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';

/**
 *
 * @param configService Need to get values from environment to config MailerOptions
 * @returns MailerOptions to send mail
 */
export const mailConfig = (configService: ConfigService): MailerOptions => ({
  ...(configService.get('MAIL_MAILER').toLowerCase() === 'ses' && {
    transport: {
      SES: new AWS.SES({
        accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
        region: configService.get('AWS_DEFAULT_REGION'),
      }),
    },
  }),
  ...(configService.get('MAIL_MAILER').toLowerCase() === 'smtp' && {
    transport: {
      host: configService.get('MAIL_HOST'),
      port: configService.get('MAIL_HOST'),
      auth: {
        user: configService.get('MAIL_USERNAME'),
        pass: configService.get('MAIL_PASSWORD'),
      },
    },
  }),
  defaults: {
    ...(configService.get('MAIL_MAILER').toLowerCase() === 'ses' && {
      from: `${configService.get('MAIL_FROM_NAME')} <${configService.get(
        'AWS_FROM_EMAIL',
      )}>`,
    }),
    ...(configService.get('MAIL_MAILER').toLowerCase() === 'smtp' && {
      from: `${configService.get('MAIL_FROM_NAME')} <${configService.get(
        'MAIL_FROM_ADDRESS',
      )}>`,
    }),
  },
  template: {
    dir: path.join(path.resolve(), '/src/modules/mail/templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
});
