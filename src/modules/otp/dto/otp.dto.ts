import { IsNotEmpty, IsEmail, IsString, IsLowercase } from 'class-validator';
export class CreateOtpDto {
  @IsNotEmpty()
  @IsEmail()
  @IsLowercase()
  email: string;
}

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsEmail()
  @IsLowercase()
  email: string;
  @IsNotEmpty()
  @IsString()
  pin: string;
}
