import { IsNumber, IsOptional } from 'class-validator';

export class BookingComboDto {
  @IsOptional()
  @IsNumber()
  paymentId?: number;
  @IsNumber()
  comboId: number;

  @IsNumber()
  quantity: number;
}
