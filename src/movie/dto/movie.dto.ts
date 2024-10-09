import {
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  IsDate,
} from 'class-validator';
import { MovieStatus } from '@prisma/client'; // Import enum từ Prisma

export class MovieDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  director: string;

  @IsString()
  actors: string;

  @IsDate()
  releaseDate: Date;

  @IsNumber()
  rating: number;

  @IsOptional()
  status: MovieStatus = MovieStatus.HIDDEN; // Đặt trạng thái mặc định là HIDDEN

  @IsOptional()
  @IsString()
  banner?: string;

  @IsOptional()
  @IsString()
  trailer?: string;

  @IsNumber()
  duration: number;
}
