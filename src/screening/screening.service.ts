import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScreeningDTO } from './dto/screening.dto';
import { format } from 'path';
import { SeatService } from 'src/seat/seat.service';

@Injectable()
export class ScreeningService {
  constructor(private readonly prismaService: PrismaService) {}
  async getAll() {
    return this.prismaService.screening.findMany();
  }

  async create(data: ScreeningDTO) {
    // this.seatService.createSeatsForScreening(data.screeningId);
    return this.prismaService.screening.create({ data });
  }

  async update(screeningId: number, data: ScreeningDTO) {
    return this.prismaService.screening.update({
      where: { screeningId },
      data,
    });
  }

  async delete(screeningId: number) {
    return this.prismaService.screening.delete({
      where: { screeningId },
    });
  }

  async findById(screeningId: number) {
    return this.prismaService.screening.findUnique({ where: { screeningId } });
  }

  async getRoomIdByScreeningId(screeningId: number) {
    const roomId = await this.prismaService.screening.findUnique({
      where: { screeningId },
      select: { roomId: true },
    });
    return roomId;
  }
}
