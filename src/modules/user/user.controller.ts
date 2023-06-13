import { Controller, Get, Param, UseGuards, Version } from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseInterface } from '@interfaces/Responses/response.interface';
import { AuthenticationGuard } from '../auth/guards/auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(AuthenticationGuard)
  @Get('/:id')
  async getUserProfile(@Param('id') id: string): Promise<ResponseInterface> {
    const result = await this.userService.getUserProfile(id);
    return {
      success: true,
      status: 1006,
      data: result,
    };
  }
}
