import { Controller, Get, Param, Put } from '@nestjs/common';
import { SeatService } from './seat.service';
import { SeatDTO } from './dto';

@Controller('seat')
export class SeatController {
  constructor(private seatService: SeatService) {}

  @Get('getAll')
  async getAll() {
    return this.seatService.getAll();
  }

  @Put('updatestatus/:seatId')
  async update(@Param('seatId') seatId: number, data: SeatDTO) {
    return this.seatService.updateStatus(seatId, data);
  }
}
