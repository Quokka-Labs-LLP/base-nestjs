
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleService } from './google.service';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  // To authenticate with google
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}


  // Redirect url: you will get access_token of google user
  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.googleService.googleLogin(req)
  }
}


