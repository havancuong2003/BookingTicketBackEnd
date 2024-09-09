import { IsDateString, IsNumber } from 'class-validator';

export class ScreeningDTO {
  @IsNumber()
  movieId: number;

  @IsNumber()
  cinemaId: number;

  @IsNumber()
  roomId: number;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}
