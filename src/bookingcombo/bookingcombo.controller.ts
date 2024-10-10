import { Controller, Get, Param } from '@nestjs/common';
import { BookingcomboService } from './bookingcombo.service';

@Controller('bookingcombo')
export class BookingcomboController {
  constructor(private readonly bookingcomboService: BookingcomboService) {}
  @Get(':paymentId')
  async getBookingComboInforByPaymentId(@Param('paymentId') paymentId: number) {
    const bookingCombo =
      await this.bookingcomboService.getBookingComboInforByPaymentId(paymentId);
    return bookingCombo.map((combo) => ({
      bookingComboId: combo.bookingComboId,
      paymentId: combo.paymentId,
      comboId: combo.comboId,
      quantity: combo.quantity,
      comboPrice: combo.combo.price,
      comboName: combo.combo.name,
    }));
  }
}
