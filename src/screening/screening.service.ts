import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScreeningDTO } from './dto/screening.dto';
import { format } from 'path';
import { SeatService } from 'src/seat/seat.service';
import { title } from 'process';

@Injectable()
export class ScreeningService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return this.prismaService.screening.findMany();
  }

  async getScreeningByRoomId(roomId: number) {
    return this.prismaService.screening.findMany({
      include: {
        movie: {
          // Ensure 'movie' is a valid property in ScreeningInclude
          select: {
            title: true,
          },
        },

        room: {
          select: {
            roomCode: true,
          },
        },
      },
      where: { roomId },
    });
  }

  async create(data: ScreeningDTO) {
    const screening = await this.prismaService.screening.create({ data });
    // await this.seatService.createSeatsForScreening(screening.screeningId);
    return screening;
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

  async getAllInforScreening(screeningId: number) {
    const screening = await this.prismaService.screening.findUnique({
      where: { screeningId },
      include: {
        room: {
          select: {
            roomCode: true,
            cinema: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!screening) {
      return null;
    }

    const movie = await this.prismaService.movie.findUnique({
      where: { id: screening.movieId },
      select: {
        title: true,
        duration: true,
      },
    });

    return {
      movieName: movie?.title ?? '',
      duration: movie?.duration ?? 0,
      releaseDate: screening?.startTime
        ? this.formatDate(screening?.startTime)
        : '',
      startTime: screening.startTime
        ? this.formatTime(screening.startTime)
        : '',
      roomCode: screening.room?.roomCode ?? '',
      cinemaName: screening.room?.cinema?.name ?? '',
    };
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private formatTime(date: Date): string {
    return date.toTimeString().split(' ')[0].substring(0, 5);
  }
}
