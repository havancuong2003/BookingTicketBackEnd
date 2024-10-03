import { Controller, Get, Param } from '@nestjs/common';
import { ScreeningService } from '../screening/screening.service';
import { SeatService } from 'src/seat/seat.service';
import { BookingService } from 'src/booking';

@Controller('choosechair')
export class ChooseChairController {
  constructor(
    private readonly screeningService: ScreeningService,
    private readonly seatService: SeatService,
    private readonly bookingService: BookingService,
  ) {}

  @Get('/:screeningId')
  async getAll(@Param('screeningId') screeningId: string) {
    return this.seatService.getAllSeatsByScreeningId(Number(screeningId));
  }
  @Get('/booking/:screeningId')
  async getAllBooking(@Param('screeningId') screeningId: string) {
    const bookings = await this.bookingService.getAllByScreeningId(
      Number(screeningId),
    );
    const seats = await this.seatService.getAllSeatsByScreeningId(
      Number(screeningId),
    );

    // Update seat data based on bookings
    bookings.forEach((booking) => {
      const seat = seats.find((seat) => seat.seatId === booking.seatId);
      if (seat) {
        seat.userId = booking.userId; // Update userId
      }
    });

    return seats.map((seat) => {
      const booking = bookings.find(
        (booking) => booking.seatId === seat.seatId,
      );
      return {
        seatId: seat.seatId,
        status: booking ? booking.status : null, // Use booking status if exists
        userId: booking ? booking.userId : null, // Use booking userId if exists
        seatNumber: seat.seatNumber,
        rowCode: seat.rowCode,
        seatType: seat.seatType,
        roomId: seat.roomId,
        statusSeat: seat.status,
      };
    }); // Return updated seat data with booking information
  }
}
