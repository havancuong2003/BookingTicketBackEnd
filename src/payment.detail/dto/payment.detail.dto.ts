import { IsNumber, IsOptional } from 'class-validator';

export class PaymentDetailDto {
  @IsOptional() // Đánh dấu paymentId là tùy chọn
  @IsNumber()
  paymentId?: number; // Thay đổi thành optional

  @IsNumber()
  seatId: number;

  @IsNumber()
  price: number;
}
