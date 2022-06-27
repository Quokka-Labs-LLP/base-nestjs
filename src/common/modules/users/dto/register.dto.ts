import { IsString, IsInt, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrationDto {
  @IsString()
  name: string;
  
  @IsEmail()
  email: string;

  @IsString()
  image: string;
}