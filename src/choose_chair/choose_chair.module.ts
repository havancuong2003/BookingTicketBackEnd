import { Module } from '@nestjs/common';
import { ChooseChairController } from './choose_chair.controller';
import { ScreeningService } from 'src/screening';
import { SeatService } from 'src/seat/seat.service';
import { BookingService } from '../booking/booking.service';

@Module({
  controllers: [ChooseChairController],
  providers: [ScreeningService, SeatService, BookingService],
})
export class ChooseChairModule {}
