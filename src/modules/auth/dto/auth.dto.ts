import { IsNotEmpty, IsEmail, IsLowercase } from 'class-validator';
export class SignupDto {
  @IsNotEmpty()
  @IsEmail()
  @IsLowercase()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  lastName: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @IsLowercase()
  email: string;
  @IsNotEmpty()
  password: string;
}

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @IsLowercase()
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @IsLowercase()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  pin: string;
}
