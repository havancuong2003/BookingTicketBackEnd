import { IsNumber, IsOptional, IsString } from 'class-validator';

export class BookingDTO {
  @IsNumber()
  @IsOptional()
  seatId: number;

  @IsNumber()
  @IsOptional()
  screeningId: number;

  @IsNumber()
  @IsOptional()
  status: number;

  @IsNumber()
  @IsOptional()
  userId: number;
}
