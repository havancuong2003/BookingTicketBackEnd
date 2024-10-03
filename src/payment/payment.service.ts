import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentDto } from './dto';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async createPayment(data: PaymentDto) {
    try {
      const payment = await this.prisma.payment.create({
        data: {
          ...data,
          paymentDetails: {
            create: data.paymentDetails.map((detail) => ({
              seatId: detail.seatId,
              price: detail.price,
            })),
          },
        },
      });
      return payment;
    } catch (error) {
      console.error('Error creating payment:', error); // Log lỗi
      throw new Error('Failed to create payment');
    }
  }
  async updatePayment(paymentId: number) {
    const payment = await this.prisma.payment.update({
      where: { paymentId },
      data: { status: 1 },
    });
    return payment;
  }

  async getPaymentById(paymentId: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { paymentId },
      include: {
        paymentDetails: {
          include: {
            seat: {
              include: {
                room: {
                  include: {
                    cinema: true,
                  },
                },
              },
            },
          },
        },
        screening: {
          include: {
            movie: true,
          },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
    });
    return payment;
  }
}
