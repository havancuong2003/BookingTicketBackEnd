import { IsNumber, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentDetailDto } from 'src/payment.detail/dto/payment.detail.dto';

export class PaymentDto {
  @IsNumber()
  userId: number;
  @IsNumber()
  screeningId: number;

  @IsNumber()
  totalAmount: number;

  @IsNumber()
  status: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentDetailDto)
  paymentDetails: PaymentDetailDto[];
}
