import { AuthResponse } from '@interfaces/Responses/Auth/response.interface';
import { ResponseInterface } from '@interfaces/Responses/response.interface';
import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; 
import { Response } from 'express';
import { AuthService } from './auth.service';
import { FirebaseGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {
  }
  
  @Post()
  @UseGuards(FirebaseGuard)
  async auth(
    @Req() request: any,
  ): Promise<ResponseInterface> {
    const tokens: AuthResponse = await this.authService.auth(request.user);
  
    let responseData: AuthResponse = {
      accessToken: tokens.accessToken,
      refreshToken : tokens.refreshToken
    }

    return {
      success: true,
      status: 200,
      data: responseData
    };
  }

}

