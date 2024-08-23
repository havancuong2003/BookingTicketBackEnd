import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { PrismaService } from '../prisma/prisma.service'; // Điều chỉnh theo đường dẫn thực tế

@Module({
  controllers: [MovieController],
  providers: [MovieService, PrismaService],
})
export class MovieModule {}
