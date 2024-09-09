import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SeatDTO {
  @IsNumber()
  @IsOptional()
  seatId: number;

  @IsNumber()
  @IsOptional()
  roomId: number;

  @IsNumber()
  @IsOptional()
  screeningId: number;

  @IsNumber()
  @IsOptional()
  seatNumber: number;

  @IsString()
  @IsOptional()
  rowCode: string;

  @IsNumber()
  @IsOptional()
  seatType: number;

  @IsNumber()
  @IsOptional()
  status: number;

  @IsNumber()
  @IsOptional()
  userId: number;
}
