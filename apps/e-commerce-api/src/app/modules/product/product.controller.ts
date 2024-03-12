import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AtGuard } from '../../common/guards/at.guard';
import { GetCurrentUserId } from '../../common/decorators';
import { FilterProductDto } from './dto/filter-products.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @GetCurrentUserId() userId: number,
    @Body() createProductDto: CreateProductDto
  ) {
    return this.productService.create({ userId, ...createProductDto });
  }

  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@GetCurrentUserId() userId: number) {
    return this.productService.findAll(userId);
  }

  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':name')
  filterProductsByName(@Param('name') name: string) {
    return this.productService.filterProductsByName(name);
  }

  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('products')
  filterProductsByPage(@Body() productDto: FilterProductDto) {
    return this.productService.filterProductsByPage(productDto);
  }
}
