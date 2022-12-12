import * as Joi from 'joi';
import { ConfigModuleOptions } from '@nestjs/config';

export const dotenvConfig = (): ConfigModuleOptions => ({
  validationSchema: Joi.object({
    NODE_ENV: Joi.string().required(),
    API_VERSION: Joi.string().required(),
    SERVER_PORT: Joi.number().required(),
    MAIL_MAILER: Joi.string().required().valid('ses', 'smtp'),
    MAIL_HOST: Joi.alternatives().conditional('MAIL_MAILER', {
      is: 'smtp',
      then: Joi.string().required(),
      otherwise: Joi.optional(),
    }),
    MAIL_PORT: Joi.alternatives().conditional('MAIL_MAILER', {
      is: 'smtp',
      then: Joi.number().required(),
      otherwise: Joi.optional(),
    }),
    MAIL_USERNAME: Joi.alternatives().conditional('MAIL_MAILER', {
      is: 'smtp',
      then: Joi.string().required(),
      otherwise: Joi.optional(),
    }),
    MAIL_PASSWORD: Joi.alternatives().conditional('MAIL_MAILER', {
      is: 'smtp',
      then: Joi.string().required(),
      otherwise: Joi.optional(),
    }),
    MAIL_ENCRYPTION: Joi.alternatives().conditional('MAIL_MAILER', {
      is: 'smtp',
      then: Joi.string().required(),
      otherwise: Joi.optional(),
    }),
    MAIL_FROM_NAME: Joi.alternatives().conditional('MAIL_MAILER', {
      is: 'smtp',
      then: Joi.string().required(),
      otherwise: Joi.optional(),
    }),
    MAIL_FROM_ADDRESS: Joi.alternatives().conditional('MAIL_MAILER', {
      is: 'smtp',
      then: Joi.string().required(),
      otherwise: Joi.optional(),
    }),
    AWS_ACCESS_KEY_ID: Joi.alternatives().conditional('MAIL_MAILER', {
      is: 'ses',
      then: Joi.string().required(),
      otherwise: Joi.optional(),
    }),
    AWS_SECRET_ACCESS_KEY: Joi.alternatives().conditional('MAIL_MAILER', {
      is: 'ses',
      then: Joi.string().required(),
      otherwise: Joi.optional(),
    }),
    AWS_FROM_EMAIL: Joi.alternatives().conditional('MAIL_MAILER', {
      is: 'ses',
      then: Joi.string().required(),
      otherwise: Joi.optional(),
    }),
    AWS_DEFAULT_REGION: Joi.alternatives().conditional('MAIL_MAILER', {
      is: 'ses',
      then: Joi.string().required(),
      otherwise: Joi.optional(),
    }),
  }),
  envFilePath: ['.env.local', '.env.development', '.env.production'],
  isGlobal: true,
  cache: true,
});
