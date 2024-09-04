import { Module } from '@nestjs/common';
import { SeatController } from './seat.controller';
import { SeatService } from './seat.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SeatController],
  providers: [SeatService, PrismaService],
})
export class SeatModule {}
