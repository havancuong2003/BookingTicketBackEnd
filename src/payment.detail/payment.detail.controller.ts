import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentDetailService } from './payment.detail.service';
import { PaymentDetailDto } from './dto';

@Controller('paymentdetail')
export class PaymentDetailController {
  constructor(private readonly paymentDetailService: PaymentDetailService) {}
  @Get(':paymentId')
  async getPaymentDetail(@Param('paymentId') paymentId: number) {
    const paymentDetail =
      await this.paymentDetailService.getPaymentDetail(paymentId);
    return paymentDetail.map((detail) => ({
      seatId: detail.seatId,
      price: detail.price,
      rowCode: detail.seat.rowCode,
      seatNumber: detail.seat.seatNumber,
    }));
  }
}
