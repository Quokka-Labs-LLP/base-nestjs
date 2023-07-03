import { AuthPayload } from '@interfaces/Auth/payload.interfaces';
import { AuthResponse } from '@interfaces/Auth/response.interfaces';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  
  async auth(phoneNumber: string): Promise<AuthResponse> {
    const payload: AuthPayload = {
      phoneNumber: phoneNumber,
    }

    return await this.getAccessAndRefreshTokens(payload);
  }

  async getAccessAndRefreshTokens(authPayload: AuthPayload): Promise<{accessToken: string, refreshToken: string}> {
    // Generate access token
    const accessToken = await this.jwtService.signAsync(authPayload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
    });

    // Generate refresh token
    const refreshToken = await this.jwtService.signAsync(authPayload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}