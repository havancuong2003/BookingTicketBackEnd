import { Controller, Post, Body, Req, Res, Get, Query } from '@nestjs/common';
import { VnpayService } from './vnpay.service';
import { Request, Response } from 'express';
import { log } from 'console';
import { Code } from 'typeorm';

@Controller('vnpay')
export class VnpayController {
  constructor(private readonly vnpayService: VnpayService) {}

  @Post('create-payment-url')
  createPaymentUrl(@Body() body: any, @Req() req: Request) {
    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection as any).socket.remoteAddress;

    const { amount, orderInfo } = body;
    const paymentUrl = this.vnpayService.createPaymentUrl(
      amount,
      ipAddr,
      orderInfo,
    );

    return paymentUrl;
  }

  @Get('vnpay_return')
  async vnpayReturn(@Query() query: any, @Res() res: Response) {
    const { isValid, responseCode } = this.vnpayService.verifyPayment(query);

    if (isValid) {
      res.status(200).json({
        message: 'Payment successful',
        data: query,
        code: responseCode,
      });
    } else {
      res.status(400).json({
        message: 'Payment failed',
        data: query,
        code: responseCode,
      });
    }
  }
}
