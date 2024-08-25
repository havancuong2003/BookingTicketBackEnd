import { IsEmail, IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  hashPass: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  picture: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsInt()
  @IsOptional()
  roleId: number;
}
