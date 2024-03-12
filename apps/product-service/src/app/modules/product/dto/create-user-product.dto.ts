import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserProductDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
