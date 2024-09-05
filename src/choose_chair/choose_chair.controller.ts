import { Controller, Get, Param } from '@nestjs/common';
import { ScreeningService } from '../screening/screening.service';
import { SeatService } from 'src/seat/seat.service';

@Controller('choosechair')
export class ChooseChairController {
  constructor(
    private readonly screeningService: ScreeningService,
    private readonly seatService: SeatService,
  ) {}

  @Get('/:id')
  async getAll(@Param('id') screeningId: string) {
    // this.seatService.createSeatsForScreening(parseInt(screeningId));
    return this.seatService.getAll();
  }
}
