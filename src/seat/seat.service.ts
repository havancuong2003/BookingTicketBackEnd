import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SeatDTO } from './dto';
import { Repository } from 'typeorm';
import { Seat } from '@prisma/client';
import { ScreeningService } from 'src/screening';

@Injectable()
export class SeatService {
  constructor(
    private readonly prismaService: PrismaService,
    // private readonly screeningService: ScreeningService,
  ) {}
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
    const idRoom = await this.prismaService.screening.findUnique({
      where: { screeningId },
      select: { roomId: true },
    });
    for (const row of rows) {
      for (let seatNumber = 1; seatNumber <= 12; seatNumber++) {
        const seatType = row === 'C' || row === 'D' ? 1 : 0;
        const seat = {
          rowCode: row,
          seatNumber,
          seatType,
          status: 0,
          screeningId,
          roomId: idRoom,
        };
        seats.push(seat);
      }
    }
    return await this.prismaService.seat.createMany({
      data: seats,
      skipDuplicates: true,
    });
  }

  async updateToDefault(seatId: number, data: SeatDTO) {
    data.userId = null;
    data.status = 0;
    return this.prismaService.seat.update({
      where: { seatId },
      data,
    });
  }
  async updateStatus(seatId: number, data: SeatDTO) {
    const seat = await this.prismaService.seat.findUnique({
      where: { seatId },
    });

    return this.prismaService.seat.update({
      where: { seatId },
      data: {
        roomId: seat.roomId ? seat.roomId : null,
        screeningId: seat.screeningId,
        seatNumber: seat.seatNumber,
        rowCode: seat.rowCode ? seat.rowCode : null,
        seatType: seat.seatType,
        status: seat.status == 0 ? 1 : 0,
      },
    });
  }
}
