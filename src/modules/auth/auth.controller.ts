import { AuthResponse } from '@interfaces/Auth/response.interfaces';
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
  
    /* Save refresh token as http only cookie in the client */
    response.cookie('jwt', tokens.refreshToken, {
      httpOnly: true,
      maxAge: this.configService.get<number>('REFRESH_COOKIE_EXPIRATION'),
      sameSite: 'none',
      secure: true,
    });

    let responseData: {
      accessToken: string,
      refreshToken?: string
    } = {
      accessToken: tokens.accessToken
    }

    // Send refreshToken in response if environment is not prod
    if (this.env !== 'prod' && this.env !== 'production') {
      responseData.refreshToken = tokens.refreshToken;
    }

    return {
      success: true,
      status: 200,
      message: "success",
      data: responseData
    };
  }
}