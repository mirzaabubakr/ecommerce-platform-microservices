import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  productName: string;

  @IsNotEmpty()
  @IsNumber()
  productPrice: number;

  @IsOptional()
  userId: number;
}
