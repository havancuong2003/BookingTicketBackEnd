import { Module } from '@nestjs/common';
import { ScreeningController } from './screening.controller';
import { ScreeningService } from './screening.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SeatService } from 'src/seat/seat.service';

@Module({
  providers: [ScreeningService, PrismaService, SeatService],
  controllers: [ScreeningController],
})
export class ScreeningModule {}
