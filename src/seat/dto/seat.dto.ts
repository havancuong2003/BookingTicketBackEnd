import { IsNumber } from 'class-validator';

export class SeatDTO {
  @IsNumber()
  seatId: number;

  @IsNumber()
  roomId: number;

  @IsNumber()
  screeningId: number;

  @IsNumber()
  seatNumber: number;

  @IsNumber()
  rowCode: string;

  @IsNumber()
  seatType: number;

  @IsNumber()
  status: number;

  @IsNumber()
  userId: number;
}
