import { ForbiddenException } from '@nestjs/common';
import * as admin from 'firebase-admin';
export class FirebaseUtils {
  static async getMobileNumber(firebaseToken: string) {
    let mobileNumber: string;
    try {
      const firebaseTokenDecoded = await admin
        .auth()
        .verifyIdToken(firebaseToken);
      mobileNumber = firebaseTokenDecoded.phone_number as string;
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
    return mobileNumber;
  }
}
