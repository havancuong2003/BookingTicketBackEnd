import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingDTO } from './dto';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Get('getAll')
  async getAll(@Param('screeningId') screeningId: string) {
    return this.bookingService.getAllByScreeningId(Number(screeningId));
  }

  @Post('updatestatus/:seatId')
  async createBookingSeat(
    @Param('seatId') seatId: number,
    @Body() data: BookingDTO,
  ) {
    data.seatId = Number(seatId);
    return this.bookingService.createBooking(data);
  }

  @Get('findSeatsByUserId/:userId')
  async findSeatsByUserId(@Param('userId') userId: number) {
    return this.bookingService.findBookingSeatsByUserId(Number(userId));
  }
  @Get('findSeatsDoneByUserId/:userId')
  async findSeatsDoneByUserId(@Param('userId') userId: number) {
    return this.bookingService.findSeatsDoneByUser(Number(userId));
  }

  @Delete('updateStatusByUserIdToDefault/:userId')
  async updateStatusByUserIdToDefault(@Param('userId') userId: number) {
    const deletedSeats =
      await this.bookingService.updateStatusByUserIdToDefault(Number(userId));
    if (deletedSeats.length === 0) {
      return { message: 'No seats found to delete.' };
    }
    return { message: 'Seats deleted successfully.', deletedSeats };
  }
  @Delete('deleteSeatChooseByUserId/:userId/:seatId')
  async deleteSeatByUserIdToDefault(
    @Param('userId') userId: number,
    @Param('seatId') seatId: number,
  ) {
    return this.bookingService.deleteSeatsBookingUser(
      Number(userId),
      Number(seatId),
    );
  }

  @Get('findSeatsBookingByUserId/:userId')
  async findSeatsBookingByUserId(@Param('userId') userId: number) {
    return this.bookingService.findSeatsBookingByUserId(Number(userId));
  }
  @Get('findSeatsAndTypeSeatBookingByUserId/:userId')
  async findSeatsAndTypeSeatBookingByUserId(@Param('userId') userId: number) {
    const data = await this.bookingService.findSeatsAndTypeSeatBookingByUserId(
      Number(userId),
    );
    return data.map((seat) => ({
      seatId: seat.seatId,
      seatType: seat.seat.seatType,
    }));
  }

  @Put('updateSeatsDoneByUserId/:userId')
  async updateSeatsDoneByUserId(@Param('userId') userId: number) {
    return this.bookingService.updateSeatsDoneByUserId(Number(userId));
  }
}
