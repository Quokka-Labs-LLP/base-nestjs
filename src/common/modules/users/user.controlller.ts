import { Body, Controller, Get, HttpException, HttpStatus, Post, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import UserDto from './dto/user.dto';
import { UserService } from './user.service';

@Controller('/users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  // Get user with emailId
  @Post('/get-user')
  async getUser(@Body() userData: UserDto ) {
    try {
      const user =  await this.userService.getByEmail(userData.email);
      console.log('user',user);
      if(user) 
        return {
            code: 1002,
            data: user
        };
        
      return {
          code: 1003,
          data: null
      };
      
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

}
