import { Controller, Get, Param } from '@nestjs/common';
import { ScreeningService } from '../screening/screening.service';
import { SeatService } from 'src/seat/seat.service';

@Controller('choosechair')
export class ChooseChairController {
  constructor(
    private readonly screeningService: ScreeningService,
    private readonly seatService: SeatService,
  ) {}

  @Get('/:screeningId')
  async getAllSeatsByScreeningId(@Param('screeningId') screeningId: string) {
    return this.seatService.getAllSeatsByScreeningId(Number(screeningId));
  }
}
