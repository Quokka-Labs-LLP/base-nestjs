import { AuthResponse } from '@interfaces/Auth/response.interface';
import { ResponseInterface } from '@interfaces/Responses/response.interface';
import { Controller, Post, Req,UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseGuard } from './guards/firebase.guard';
import { FirebaseExtendedRequest } from './interaces/extended.request';

@Controller('auth')
export class AuthController {  
  constructor(
    private readonly authService: AuthService,
  ) {}
  
  @Post()
  @UseGuards(FirebaseGuard)
  async auth(
    @Req() request: FirebaseExtendedRequest
  ): Promise<ResponseInterface> {
    const tokens: AuthResponse = await this.authService.auth(request.user.phoneNumber);

    return {
      success: true,
      status: 200,
      message: "success",
      data: tokens
    };
  }
}