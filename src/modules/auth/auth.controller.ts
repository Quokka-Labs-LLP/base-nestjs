import { AuthResponse } from '@interfaces/Auth/response.interface';
import { ResponseInterface } from '@interfaces/Responses/response.interface';
import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; 
import { Response } from 'express';
import { AuthService } from './auth.service';
import { FirebaseGuard } from './guards/firebase.guard';

@Controller('auth')
export class AuthController {
  private env;
  
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.env = configService.get<string>('NODE_ENV')
  }
  
  @Post()
  @UseGuards(FirebaseGuard)
  async auth(
    @Req() request: any,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseInterface> {
    const tokens: AuthResponse = await this.authService.auth(request.user.phone_number);

    return {
      success: true,
      status: 200,
      message: "success",
      data: tokens
    };
  }
}