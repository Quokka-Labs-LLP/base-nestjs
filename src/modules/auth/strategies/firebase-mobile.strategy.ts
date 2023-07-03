import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PASSPORT_AUTHGUARD } from '@config/constant';

@Injectable()
export class JwtFirebaseStrategy extends PassportStrategy(
  Strategy,
  PASSPORT_AUTHGUARD.JWT_FIREBASE_MOBILE,
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('FBASE_PUBLIC_KEY'),
    });
  }

  async validate(payload: any) {
    return payload;
  }
}