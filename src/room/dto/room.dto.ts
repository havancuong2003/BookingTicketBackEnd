import { IsNumber, IsString } from 'class-validator';

export class RoomDTO {
  @IsString()
  roomCode: string;

  @IsNumber()
  cinemaId: number;
}
