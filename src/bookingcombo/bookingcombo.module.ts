import { Module } from '@nestjs/common';
import { BookingcomboController } from './bookingcombo.controller';
import { BookingcomboService } from './bookingcombo.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [BookingcomboController],
  providers: [BookingcomboService, PrismaService],
})
export class BookingcomboModule {}
