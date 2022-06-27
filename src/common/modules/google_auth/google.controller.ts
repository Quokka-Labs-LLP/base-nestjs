
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { GoogleService } from './google.service';

@Controller('google')
@ApiTags('google-signup frontend')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  // To authenticate with google
  // To authenticate please visit url http://localhost:3000/google and 
  // signup with your google account and get access_token
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


