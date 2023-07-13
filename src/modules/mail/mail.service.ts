import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

/**
 *
 */
@Injectable()
export class MailService {
  /**
   *
   * @param mailerService Inject MailerService instance to use it's methods
   */
  constructor(private mailerService: MailerService) {}

  /**
   *
   * @param sendMailOptions Interface to use defined configuration properties for sending mail
   * @returns SentMessageInfo type response
   */
  async sendMail(sendMailOptions: ISendMailOptions) {
    return await this.mailerService.sendMail(sendMailOptions);
  }
}
