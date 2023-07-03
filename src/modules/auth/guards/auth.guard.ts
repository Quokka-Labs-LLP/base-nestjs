import { PASSPORT_AUTHGUARD } from "@config/constant";
import { AuthGuard } from "@nestjs/passport";
import { 
  Injectable, 
  UnauthorizedException, 
  BadRequestException 
} from "@nestjs/common";

@Injectable()
export class FirebaseMobileAuthGuard extends AuthGuard(PASSPORT_AUTHGUARD.JWT_FIREBASE_MOBILE) {
  handleRequest(err: any, user: any, info: any) {
    if (!user || err) {
      throw err || new UnauthorizedException (info?.message ?? 'Unauthorized');
    }

    if (!user.phone_number) {
      throw new BadRequestException(
        'Could not extract mobile number from firebase token',
      );
    }

    return user;
  }
}