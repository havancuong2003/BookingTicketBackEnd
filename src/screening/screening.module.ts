import { Module } from '@nestjs/common';
import { ScreeningController } from './screening.controller';
import { ScreeningService } from './screening.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ScreeningService, PrismaService],
  controllers: [ScreeningController],
})
export class ScreeningModule {}
