import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp } from '../../common/models/otp.schema';
// import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { CreateOtpDto, VerifyOtpDto } from './dto/otp.dto';
import * as argon2 from 'argon2';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
    // private mailService: MailService,
    private configService: ConfigService,
  ) {}
  async createOtp(data: CreateOtpDto): Promise<void> {
    const { email } = data;
    const otpLength = this.configService.get('OTP_LENGTH');
    const otpExpireTime = this.configService.get('OTP_EXPIRY_MINUTES');
    const pin = await this.generateOTP(otpLength);
    console.log('otp pin', pin);
    const expiry = new Date(new Date().getTime() + otpExpireTime * 60000);
    const otpCreated = await this.otpModel.findOneAndUpdate(
      { email },
      { pin: await argon2.hash(pin), expiry },
      { upsert: true },
    );
    // if (otpCreated)
    // customise email to be sent here
    //   this.mailService.sendMail({
    //     to: email,
    //     subject: 'OTP Verification',
    //     context: {
    //       otp: pin,
    //     },
    //   });
  }

  async verifyOtp(data: VerifyOtpDto) {
    const { email, pin } = data;
    const otpDetails: any = await this.otpModel.findOne({ email });
    if (!otpDetails) throw new NotFoundException('Not found');
    else if (!(await argon2.verify(otpDetails.pin, pin)))
      throw new ForbiddenException('Invalid otp');
    else if (new Date(otpDetails.expiry).getTime() < new Date().getTime())
      throw new ForbiddenException('Otp expired');
  }

  async generateOTP(otpLength: number) {
    const length = otpLength; // Length of the OTP
    const digits = '0123456789';
    let OTP = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      OTP += digits[randomIndex];
    }

    return OTP;
  }
}
