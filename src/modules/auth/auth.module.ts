import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtFirebaseStrategy } from './strategies/firebase-mobile.strategy';

@Module({
  imports: [
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtFirebaseStrategy
  ],
})
export class AuthModule {}