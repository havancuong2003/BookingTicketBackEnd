import { Module } from '@nestjs/common';
import { PaymentDetailController } from './payment.detail.controller';
import { PaymentDetailService } from './payment.detail.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({})
export class PaymentDetailModule {
  providers: [PaymentDetailService, PrismaService];
  controllers: [PaymentDetailController];
}
