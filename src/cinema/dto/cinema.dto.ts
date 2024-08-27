import { IsDate, IsDateString, IsNumber, IsString } from 'class-validator';

export class CinemaDTO {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsNumber()
  totalScreens: number;
}
