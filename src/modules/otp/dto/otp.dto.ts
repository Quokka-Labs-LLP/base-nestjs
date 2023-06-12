import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
export class CreateOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  pin: string;
}
