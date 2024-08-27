import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CinemaDTO } from './dto/cinema.dto';

@Injectable()
export class CinemaService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.cinema.findMany();
  }

  async create(data: CinemaDTO) {
    console.log('data:', data);

    return this.prisma.cinema.create({ data });
  }

  async update(cinemaId: number, data: CinemaDTO) {
    return this.prisma.cinema.update({
      where: { cinemaId },
      data,
    });
  }

  async delete(cinemaId: number) {
    return this.prisma.cinema.delete({ where: { cinemaId } });
  }

  async findById(cinemaId: number) {
    return this.prisma.cinema.findUnique({ where: { cinemaId } });
  }
}
