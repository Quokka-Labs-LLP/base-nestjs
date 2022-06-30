import { Module } from '@nestjs/common';
import { GoogleAuthenticationController } from './auth.controller';
import { GoogleAuthenticationService } from './auth.service';
import { UserModule } from '../users/user.module';

@Module({
  imports: [UserModule],
  controllers: [GoogleAuthenticationController],
  providers: [GoogleAuthenticationService],
})
export class GoogleAuthenticationModule {}