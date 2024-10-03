import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomDTO } from './dto/room.dto';
import { SeatService } from 'src/seat/seat.service';

@Injectable()
export class RoomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly seatService: SeatService,
  ) {}

  async getAll() {
    return this.prisma.room.findMany();
  }

  async getRoomByCinemaId(cinemaId: number) {
    return this.prisma.room.findMany({
      include: {
        cinema: {
          select: {
            name: true,
          },
        },
      },
      where: { cinemaId },
    });
  }

  async findById(roomId: number) {
    return this.prisma.room.findUnique({
      include: {
        cinema: {
          select: {
            name: true,
          },
        },
      },
      where: { roomId },
    });
  }

  async create(data: RoomDTO) {
    const room = await this.prisma.room.create({ data });
    await this.seatService.createSeatsForRoom(room.roomId, room.roomId);
    return room;
  }
  async update(roomId: number, data: RoomDTO) {
    return this.prisma.room.update({
      where: { roomId },
      data,
    });
  }

  async delete(roomId: number) {
    return this.prisma.room.delete({ where: { roomId } });
  }

  async getCinemaByRoomId() {
    return this.prisma.room.findMany({
      include: {
        cinema: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
