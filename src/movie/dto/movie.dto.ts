import {
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  IsDate,
  IsArray,
  IsInt,
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

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Kiểm tra từng phần tử trong mảng là số nguyên
  types?: string[]; // Mảng ID của các loại phim
}
