import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
// import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';
import { UserService } from '../users/user.service';
 
@Injectable()
export class GoogleAuthenticationService {
  oauthClient: Auth.OAuth2Client;
  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {
    const clientID = this.configService.get('GOOGLE_AUTH_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_AUTH_CLIENT_SECRET');
 
    this.oauthClient = new google.auth.OAuth2(
      clientID,
      clientSecret
    );
  }

  async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;
   
    this.oauthClient.setCredentials({
      access_token: token
    })
   
    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient
    });
   console.log('userInfoResponse data', userInfoResponse.data)
    return userInfoResponse.data;
  }

 
  async authenticate(token: string) {
    const tokenInfo = await this.oauthClient.getTokenInfo(token);
    const email = tokenInfo.email;  
    console.log('tokenInfo', tokenInfo)

    try {
      const user = await this.userService.getByEmail(email);
      if (user)
          return this.userService.handleRegisteredUser(user);
      const data = await this.getUserData(token);
      return this.userService.registerUser(token, email,data);
      } catch (error) {
      if (error.status !== 404) {
        throw new error;
      }
    }

  }


}
