import { Body, Controller, Post } from '@nestjs/common';
import { ResponseInterface } from '@interfaces/Responses/response.interface';
import { OtpService } from './otp.service';
import { CreateOtpDto, VerifyOtpDto } from './dto/otp.dto';

@Controller('otp')
export class OtpController {
  constructor(private otpService: OtpService) {}

  @Post()
  async createOtp(@Body() data: CreateOtpDto): Promise<ResponseInterface> {
    await this.otpService.createOtp(data);
    return {
      success: true,
      status: 1002,
    };
  }

  @Post('/verify')
  async verifyOtp(@Body() data: VerifyOtpDto): Promise<ResponseInterface> {
    await this.otpService.verifyOtp(data);
    return {
      success: true,
      status: 1003,
      message: 'Otp verified successfully',
    };
  }
}
