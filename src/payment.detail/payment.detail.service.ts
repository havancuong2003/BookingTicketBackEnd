import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentDetailDto } from './dto';
import { PaymentDto } from 'src/payment/dto';

@Injectable()
export class PaymentDetailService {
  constructor(private readonly prisma: PrismaService) {}

  async getPaymentDetail(paymentId: number) {
    const paymentDetail = await this.prisma.paymentDetail.findMany({
      where: {
        paymentId: paymentId,
      },
      include: {
        seat: {
          select: {
            rowCode: true,
            seatNumber: true,
          },
        },
      },
    });
    return paymentDetail;
  }
}
