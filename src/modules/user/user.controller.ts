import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseInterface } from '@interfaces/Responses/response.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  async getUserById(@Param('id') id: string): Promise<ResponseInterface> {
    const result = await this.userService.getUserById(id);
    return { status: 1000, data: result };
  }
}
