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
      message: 'Otp created successfully',
    };
  }

  @Post('/verify')
  async verifyOtp(@Body() data: VerifyOtpDto): Promise<ResponseInterface> {
    await this.otpService.verifyOtp(data);
    return {
      success: true,
      message: 'Otp verified successfully',
    };
  }
}
