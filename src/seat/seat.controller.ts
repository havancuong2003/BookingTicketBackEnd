import { Body, Controller, Get, Param, Put } from '@nestjs/common';
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
  async update(@Param('seatId') seatId: number, @Body() data: SeatDTO) {
    return this.seatService.updateStatus(Number(seatId), data);
  }

  @Get('findSeatsByUserId/:userId')
  async findSeatsByUserId(@Param('userId') userId: number) {
    return this.seatService.findSeatsByUserId(Number(userId));
  }
  @Get('findSeatsDoneByUserId/:userId')
  async findSeatsDoneByUserId(@Param('userId') userId: number) {
    return this.seatService.findSeatsDoneByUserId(Number(userId));
  }

  @Put('updateStatusByUserIdToDefault/:userId')
  async updateStatusByUserIdToDefault(@Param('userId') userId: number) {
    return this.seatService.updateStatusByUserIdToDefault(Number(userId));
  }
}
