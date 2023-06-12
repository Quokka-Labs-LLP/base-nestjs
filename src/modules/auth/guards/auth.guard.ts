import { PASSPORT_AUTHGUARD } from '@config/constant';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthenticationGuard extends AuthGuard(PASSPORT_AUTHGUARD.JWT) {}

@Injectable()
export class RefreshAuthGuard extends AuthGuard(
  PASSPORT_AUTHGUARD.JWT_REFRESH,
) {}
