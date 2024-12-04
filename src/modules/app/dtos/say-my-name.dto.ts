import { IsInt, IsString } from 'class-validator';

/**
 *
 */
export class sayMyNameDTO {
  @IsString()
  name: string;

  @IsInt()
  age: number;
}
