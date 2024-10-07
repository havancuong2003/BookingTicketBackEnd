import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class MenuDto {
  @IsOptional() // Nếu không cần thiết, có thể bỏ qua
  id?: number; // Nếu sử dụng autoincrement, không cần truyền id

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(['FOOD', 'DRINK']) // Enum chỉ cho phép giá trị là FOOD hoặc DRINK
  type: 'FOOD' | 'DRINK';

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  image?: string; // URL ảnh, có thể là tuỳ chọn

  @IsNotEmpty() // Đảm bảo quantity không được để trống
  @IsNumber()
  quantity: number; // Số lượng của món ăn
}
