import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { MenuDto } from './menu.dto';

export class ComboDto {
  @IsNotEmpty()
  @IsString()
  name: string; // Tên combo

  @IsNotEmpty()
  @IsNumber()
  price: number; // Giá combo

  @IsOptional()
  @IsString()
  image?: string; // Đường dẫn hình ảnh (có thể để trống)

  @IsNotEmpty()
  @IsArray()
  items: MenuDto[];
}
