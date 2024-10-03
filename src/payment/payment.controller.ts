import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDto } from './dto';
import { EmailService } from 'src/email/email.service';
import { PaymentDetailService } from 'src/payment.detail';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    // private readonly paymentDetailService: PaymentDetailService,
    // private readonly emailService: EmailService,
  ) {}

  @Post()
  async createPayment(@Body() data: PaymentDto) {
    try {
      const payment = await this.paymentService.createPayment(data);
      return payment;
    } catch (error) {
      throw new Error('Failed to create payment');
    }
  }
  @Get(':paymentId')
  async getPaymentById(@Param('paymentId') paymentId: number) {
    const payment = await this.paymentService.getPaymentById(paymentId);

    return {
      paymentId: payment.paymentId,
      userId: payment.userId,
      screeningId: payment.screeningId,
      totalAmount: payment.totalAmount,
      paymentDate: payment.paymentDate,
      status: payment.status,
      roomCode: payment.paymentDetails[0]?.seat?.room?.roomCode,
      cinemaName: payment.paymentDetails[0]?.seat?.room?.cinema?.name,
      movieTitle: payment.screening.movie.title,
    };
  }
  @Put(':paymentId')
  async updatePayment(@Param('paymentId') paymentId: number) {
    const payment = await this.paymentService.updatePayment(paymentId);
    return payment;
  }
}
