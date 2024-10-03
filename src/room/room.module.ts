import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SeatService } from 'src/seat/seat.service';

@Module({
  controllers: [RoomController],
  providers: [RoomService, PrismaService, SeatService],
})
export class RoomModule {}
