import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
import { ResponseInterface } from '@interfaces/Responses/response.interface';
import { LoginResponse } from './responses/login.interface';
import { RefreshAuthGuard } from './guards/auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  async signup(@Body() data: SignupDto): Promise<ResponseInterface> {
    await this.authService.signup(data);
    return {
      success: true,
      status: 1001,
    };
  }

  @Post('/login')
  async login(@Body() data: LoginDto): Promise<ResponseInterface> {
    const result: LoginResponse = await this.authService.login(data);
    return {
      success: true,
      status: 1004,
      data: result,
    };
  }

  @UseGuards(RefreshAuthGuard)
  @Get('/refresh-token')
  async refreshTokens(@Req() req: Request): Promise<ResponseInterface> {
    const user: any = req.user;
    const accessToken = await this.authService.refreshTokens(
      user.userId,
      user.refreshToken,
    );
    return {
      success: true,
      status: 1005,
      data: { accessToken },
    };
  }
}
