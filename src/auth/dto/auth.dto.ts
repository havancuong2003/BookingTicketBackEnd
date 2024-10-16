import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password too weak. It should contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
    },
  )
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50) // Giới hạn độ dài tối đa là 50 ký tự
  @MinLength(2) // Giới hạn độ dài tối thiểu là 3 ký tự
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50) // Giới hạn độ dài tối đa là 50 ký tự
  @MinLength(2) // Giới hạn độ dài tối thiểu là 3 ký tự
  lastName: string;
}
