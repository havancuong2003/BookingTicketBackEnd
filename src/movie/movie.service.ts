import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MovieDto } from './dto/movie.dto';

@Injectable()
export class MovieService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.movie.findMany();
  }

  async create(data: MovieDto) {
    console.log('data:', data);
    return this.prisma.movie.create({ data });
  }

  async update(id: number, data: MovieDto) {
    return this.prisma.movie.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.movie.delete({ where: { id } });
  }

  async findById(id: number) {
    return this.prisma.movie.findUnique({ where: { id } });
  }
}
