import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { SeatService } from './seat.service';
import { SeatDTO } from './dto';

@Controller('seat')
export class SeatController {
  constructor(private seatService: SeatService) {}
}
