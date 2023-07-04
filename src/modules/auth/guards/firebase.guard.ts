import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { FirebaseUtils } from '@utils/firebase.utils';
import { Request } from 'express';

@Injectable()
export class FirebaseGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const firebaseToken = this.extractTokenFromRequest(request);
    if (!firebaseToken) {
      throw new ForbiddenException('Firebase token missing');
    }
    const mobileNumber = await FirebaseUtils.getMobileNumber(firebaseToken);
    if (!mobileNumber) {
      throw new BadRequestException('Could not extract mobile number');
    }
    request['user'] = {
      mobileNumber,
    };
    return true;
  }

  extractTokenFromRequest(
    request: Request,
  ): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  };
}