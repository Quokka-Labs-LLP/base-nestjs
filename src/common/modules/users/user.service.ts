import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import User from './user.entity';
import { RegistrationDto } from './dto/register.dto';
import { google } from 'googleapis';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }


  async createWithGoogle(email: string, name: string,image: string) {

    const newUser = await this.userRepository.create({
      email,
      name,
      image,
      isRegisteredWithGoogle: true,
    });
    console.log('new user', newUser)
    await this.userRepository.save(newUser);

    return newUser;
  }


  async registerUser(token: string, email: string, data: any) {
    const userData = data;
    console.log('userData', userData)

    const name = userData.name;
   
    const user = await this.createWithGoogle(email, name, userData.picture);
   
    // return this.handleRegisteredUser(user);
    return {
      code: 2002,
      data: user
    }
  }

  async handleRegisteredUser(user: User) {
    if (!user.isRegisteredWithGoogle) {
      throw new UnauthorizedException();
    }

    return {
      code: 1002,
      data: user
    }
  }

  async getByEmail(email: string) {
    console.log('email',email);
    const user = await this.userRepository.findOne({
      where: {
        email
      } 
    
    });
    console.log('uuuser', user)
    return user;
  }

}
