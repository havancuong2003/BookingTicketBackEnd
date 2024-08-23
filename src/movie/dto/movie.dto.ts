import { IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class MovieDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  director: string;

  @IsString()
  actors: string;

  @IsDateString()
  releaseDate: Date;

  @IsNumber()
  rating: number;

  @IsString()
  status: string;
  @IsOptional()
  banner: string;

  @IsOptional()
  @IsString()
  trailer?: string;

  @IsNumber()
  duration: number;
}
