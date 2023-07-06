import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const firebaseToken = this.extractTokenFromRequest(request);
    if (!firebaseToken) {
      throw new ForbiddenException('Firebase token missing');
    }
    const phoneNumber = await this.getPhoneNumber(firebaseToken);
    if (!phoneNumber) {
      throw new BadRequestException('Could not extract phone number');
    }
    request['user'] = {
      phoneNumber,
    };
    return true;
  }

  async getPhoneNumber(firebaseToken: string) {
    let phoneNumber: string;
    try {
      const firebaseTokenDecoded = await admin
        .auth()
        .verifyIdToken(firebaseToken);
      
      phoneNumber = firebaseTokenDecoded.phone_number as string;
    } catch (err) {
      switch (err.code) {
        case 'auth/id-token-expired':
          throw new ForbiddenException('Firebase token has expired');
        case 'auth/argument-error':
          throw new ForbiddenException('Firebase token in invalid');
        default:
          throw err;
      }
    }
    return phoneNumber;
  }

  extractTokenFromRequest(
    request: Request,
  ): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  };
}