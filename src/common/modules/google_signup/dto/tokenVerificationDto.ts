import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
 
export class TokenVerificationDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
 
export default TokenVerificationDto;