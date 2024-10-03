import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingDTO } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}
  async getAllByScreeningId(screeningId: number) {
    return this.prisma.booking.findMany({
      where: { screeningId },
    });
  }
  async createBooking(data: BookingDTO) {
    return this.prisma.booking.create({
      data: {
        ...data,
        status: 1,
      },
    });
  }
  async updateStatusByUserIdToDefault(userId: number) {
    // Fetch seats to be deleted
    const seatsToDelete = await this.prisma.booking.findMany({
      where: { userId, status: 1 },
    });

    // Delete the seats
    await this.prisma.booking.deleteMany({
      where: { userId, status: 1 },
    });

    return seatsToDelete; // Return the deleted seats if needed
  }
  async deleteSeatsBookingUser(userId: number, seatId: number) {
    const seatsToDelete = await this.prisma.booking.findFirst({
      where: { userId, seatId },
    });

    // Delete the seats
    await this.prisma.booking.deleteMany({
      where: { userId, seatId },
    });

    return seatsToDelete;
  }
  async findSeatsBookingUser(screeningId: number) {
    return await this.prisma.booking.findMany({
      where: { screeningId },
      select: {
        seatId: true,
        status: true,
      },
    });
  }
  async findSeatsDoneByUser(userId: number) {
    return await this.prisma.booking.findMany({
      where: { userId, status: 2 },
      select: {
        seatId: true,
      },
    });
  }

  async findBookingSeatsByUserId(userId: number) {
    return await this.prisma.booking.findMany({
      where: { userId },
      select: {
        seatId: true,
      },
    });
  }
  async findSeatsBookingByUserId(userId: number) {
    return await this.prisma.booking.findMany({
      where: { userId, status: 1 },
      select: {
        seatId: true,
      },
    });
  }
  async updateSeatsDoneByUserId(userId: number) {
    return await this.prisma.booking.updateMany({
      where: { userId, status: 1 },
      data: { status: 2 },
    });
  }
  async findSeatsAndTypeSeatBookingByUserId(userId: number) {
    return await this.prisma.booking.findMany({
      where: { userId, status: 1 },
      select: {
        seatId: true,
        seat: {
          select: {
            seatType: true,
          },
        },
      },
    });
  }
}
