import { IsNotEmpty, IsNumber, IsString, IsIn } from 'class-validator';

export class FilterProductDto {
  @IsNotEmpty()
  @IsNumber()
  page: number;

  @IsNotEmpty()
  @IsNumber()
  pageSize: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sortOrder: 'ASC' | 'DESC' = 'ASC';
}
