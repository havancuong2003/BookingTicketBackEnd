import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentDto } from './dto';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async createPayment(data: PaymentDto) {
    try {
      // Bước 1: Tạo Payment
      const payment = await this.prisma.payment.create({
        data: {
          userId: data.userId,
          screeningId: data.screeningId,
          totalAmount: data.totalAmount,
          status: data.status,
          paymentDetails: {
            create: data.paymentDetails.map((detail) => ({
              seatId: detail.seatId,
              price: detail.price,
            })),
          },
          bookingCombos: {
            create: data.bookingCombos.map((bookingCombo) => ({
              comboId: bookingCombo.comboId,
              quantity: bookingCombo.quantity,
              // paymentId sẽ tự động gán sau khi tạo Payment
            })),
          },
        },
      });

      return payment; // Trả về payment đã tạo
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
