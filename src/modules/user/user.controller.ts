import { AuthPayload } from '@interfaces/Responses/Auth/response.interface';
import { Controller, Get,Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    const userData : AuthPayload = req.user; 
    return {
        success: true,
        status: 200,
        data: userData
      };
  }

}

