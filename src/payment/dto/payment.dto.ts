import { IsNumber, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentDetailDto } from 'src/payment.detail/dto/payment.detail.dto';
import { BookingComboDto } from 'src/bookingcombo/dto/bookingcombo.dto'; // Import BookingComboDto

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingComboDto)
  bookingCombos: BookingComboDto[];
}
