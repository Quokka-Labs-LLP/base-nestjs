import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  // Get user with emailId
  @Post('/get-user')
  async createUser(@Body() email: string ) {
    try {
      const user =  await this.userService.getByEmail(email);
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
