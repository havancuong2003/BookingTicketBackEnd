import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomDTO } from './dto/room.dto';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.room.findMany();
  }

  async findById(roomId: number) {
    return this.prisma.room.findUnique({ where: { roomId } });
  }

  async create(data: RoomDTO) {
    return this.prisma.room.create({ data });
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
