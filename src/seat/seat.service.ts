import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SeatDTO } from './dto';
import { Repository } from 'typeorm';
import { Seat } from '@prisma/client';
import { ScreeningService } from 'src/screening';
import { IsNumber } from 'class-validator';

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
    const screening = await this.prismaService.screening.findUnique({
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
          roomId: screening.roomId,
        };
        seats.push(seat);
      }
    }
    return await this.prismaService.seat.createMany({
      data: seats,
      skipDuplicates: true,
    });
  }

  async updateStatus(seatId: number, data: SeatDTO) {
    const seatById = await this.prismaService.seat.findUnique({
      where: { seatId },
    });

    return this.prismaService.seat.update({
      where: { seatId },
      data: {
        seatId: seatById.seatId,
        roomId: seatById.roomId,
        screeningId: seatById.screeningId,
        seatNumber: seatById.seatNumber,
        rowCode: seatById.rowCode,
        seatType: seatById.seatType,
        status: seatById.status == 0 ? 1 : 0,
        userId: data && data.userId ? data.userId : null,
      },
    });
  }

  async findSeatsByUserId(userId: number) {
    return await this.prismaService.seat.findMany({
      where: { userId },
      select: {
        seatId: true,
        seatNumber: true,
        rowCode: true,
      },
    });
  }

  async findSeatsDoneByUserId(userId: number) {
    return await this.prismaService.seat.findMany({
      where: { userId, status: 2 },
      select: {
        seatId: true,
        seatNumber: true,
        rowCode: true,
      },
    });
  }

  async getAllSeatsByScreeningId(screeningId: number) {
    return this.prismaService.seat.findMany({
      where: { screeningId },
    });
  }

  async updateStatusByUserIdToDefault(userId: number) {
    return this.prismaService.seat.updateMany({
      where: { userId, status: 1 },
      data: {
        status: 0,
        userId: null,
      },
    });
  }
}
