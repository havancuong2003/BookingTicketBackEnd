import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SeatDTO } from './dto';
import { Repository } from 'typeorm';
import { Seat } from '@prisma/client';

@Injectable()
export class SeatService {
  constructor(private prismaService: PrismaService) {}
  private seatRepository: Repository<Seat>;

  async getAll() {
    return this.prismaService.seat.findMany();
  }

  async create(data: SeatDTO) {
    return this.prismaService.seat.create({ data });
  }

  async update(seatId: number, data: SeatDTO) {
    return this.prismaService.seat.update({
      where: { seatId },
      data,
    });
  }
  async createSeatsForScreening(screeningId: number) {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seats = [];

    for (const row of rows) {
      for (let seatNumber = 1; seatNumber <= 12; seatNumber++) {
        const seatType = row === 'C' || row === 'D' ? 1 : 0;
        const seat = this.seatRepository.create({
          rowCode: row,
          seatNumber,
          seatType,
          status: 0,
          screeningId: screeningId || null,
        });
        seats.push(seat);
      }
    }

    await this.seatRepository.save(seats);
  }

  async updateToDefault(seatId: number, data: SeatDTO) {
    data.userId = null;
    data.status = 0;
    return this.prismaService.seat.update({
      where: { seatId },
      data,
    });
  }
}
