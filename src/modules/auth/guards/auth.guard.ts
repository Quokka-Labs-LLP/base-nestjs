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

      
      // manage data in database => Get required user details from firebaseTokenDecoded and save it on db while user signup.
      // check if email exist
      // const userExist = await UserService.checkEmailExist(firebaseTokenDecoded.email)
      // if(!userExist) {
        // Sign up the user with given details

        // let apple_username;
        // In apple sign up, the name is available as firstName & lastName
        // if(firebaseTokenDecoded.sign_in_provider === 'apple.com') {
        //   apple_username = firebaseTokenDecoded.name.firstName + firebaseTokenDecoded.name.lastName
        // }
        
        //   let user = {
        //     name: apple_username || firebaseTokenDecoded.name,
        //     picture: firebaseTokenDecoded.picture,
        //     fireabase_uid: firebaseTokenDecoded.user_id,
        //     provider: firebaseTokenDecoded.sign_in_provider
        //   }
          
        //   if (firebaseTokenDecoded.firebase.identities.email?.length)
        //     user.email = firebaseTokenDecoded.firebase.identities.email[0];

        //   if (firebaseTokenDecoded.firebase.identities.phone?.length)
        //     user.phone_number = firebaseTokenDecoded.firebase.identities.phone[0];

        //   await UserService.createUser(user);
        // }

      request['user'] = {
        userId: firebaseTokenDecoded.user_id,
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
