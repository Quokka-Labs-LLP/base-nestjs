import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/createUser.dto';
import { ResponseInterface } from '@interfaces/Responses/response.interface';

@ApiTags(UserController.name)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post()
  async create(@Body() reqBody: CreateUserDto): Promise<ResponseInterface> {
    const { firstName, lastName }: CreateUserDto =
      await this.userService.createUser(reqBody);
    return {
      status: 200,
      message: 'User created successfully',
      data: { firstName, lastName },
    };
  }
}
