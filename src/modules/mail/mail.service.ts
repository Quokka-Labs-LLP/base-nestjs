import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(sendMailOptions: ISendMailOptions) {
    return await this.mailerService.sendMail(sendMailOptions);
  }
}
