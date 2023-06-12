import { JwtPayload } from '@interfaces/Auth/jwtpayload.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PASSPORT_AUTHGUARD } from '@config/constant';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  PASSPORT_AUTHGUARD.JWT_REFRESH,
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const authorizationHeader = req.get('Authorization');
    const refreshToken = authorizationHeader?.replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
