import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import { Request } from 'express';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const firebaseToken = this.extractTokenFromRequest(request);
      if (!firebaseToken) {
        throw new ForbiddenException('Firebase token missing');
      }
      const firebaseTokenDecoded = await admin
        .auth()
        .verifyIdToken(firebaseToken);

      if (!firebaseTokenDecoded) {
        throw new ForbiddenException('Firebase token has expired');
      }

      request['user'] = {
        userId: firebaseTokenDecoded.user_id,
        email: firebaseTokenDecoded.email!
      };

      return true;
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
  }
  /* Move this method to you helpers location or use one you have created to extract token from authorization header */
  extractTokenFromRequest(
    request: Request,
  ): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  };
}
