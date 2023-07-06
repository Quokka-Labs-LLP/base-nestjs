import {Request} from 'express';

export interface FirebaseExtendedRequest extends Request {
    user: {
      phoneNumber: string
    }
}
