import { IsString, IsInt, IsEmail } from 'class-validator';

export class RegistrationDto {
  @IsString()
  name: string;
  
  @IsEmail()
  email: string;

  @IsString()
  image: string;
}