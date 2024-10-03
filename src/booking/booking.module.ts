import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { SeatService } from 'src/seat/seat.service';
import { BookingController } from './booking.controller';

@Module({
  controllers: [BookingController],
  providers: [BookingService, SeatService, BookingService],
})
export class BookingModule {}
