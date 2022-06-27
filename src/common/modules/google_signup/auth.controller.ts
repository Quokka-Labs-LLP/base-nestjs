import {
    Controller,
    Post,
    ClassSerializerInterceptor,
    UseInterceptors,
    Body,
    Req,
  } from '@nestjs/common';
  import { Request } from 'express';
import { GoogleAuthenticationService } from './auth.service';
import TokenVerificationDto from './dto/tokenVerificationDto';
  

  // Google authentication
  @Controller('google-authentication')
  @UseInterceptors(ClassSerializerInterceptor)
  export class GoogleAuthenticationController {
    constructor(
      private readonly googleAuthenticationService: GoogleAuthenticationService
    ) {
    }
   
    // get user data and add in DB with the help of provided access_token.
    @Post()
    async authenticate(@Body() tokenData: TokenVerificationDto, @Req() request: Request) {
      const data = await this.googleAuthenticationService.authenticate(tokenData.token);
      console.log('user', data)   
      return data;
    }

  }