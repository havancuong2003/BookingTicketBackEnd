import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingComboDto } from './dto';

@Injectable()
export class BookingcomboService {
  constructor(private readonly prismaService: PrismaService) {}
  async getBookingComboInforByPaymentId(paymentId: number) {
    const bookingCombo = await this.prismaService.bookingCombo.findMany({
      where: {
        paymentId: paymentId,
      },
      include: {
        combo: {
          select: {
            price: true,
            name: true,
          },
        },
      },
    });
    return bookingCombo;
  }
}
