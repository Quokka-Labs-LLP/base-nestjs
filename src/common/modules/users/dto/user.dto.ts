import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
 
export class UserDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}
 
export default UserDto;