import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';

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

  @IsBoolean()
  @IsOptional()
  isEmailVerified: boolean;

  @IsString()
  @IsOptional()
  verificationToken: string | null;

  @IsDate()
  @IsOptional()
  verificationTokenExpires: Date | null;

  @IsString()
  @IsOptional()
  resetPasswordToken: string | null;

  @IsDate()
  @IsOptional()
  resetPasswordExpires: Date | null;
}
