import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleService {
  googleLogin(req) {
      console.log(req.user)
    if (!req.user) {
      return {
          code: 1001,
          data: null
      }
    }

    return {
        code: 2001,
        data: req.user
    }
  }
}