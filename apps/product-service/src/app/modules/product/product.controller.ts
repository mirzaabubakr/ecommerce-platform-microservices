import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductDto } from './dto/filter-products.dto';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern('createProduct')
  create(createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @MessagePattern('userAllProducts')
  findAll(userId: number) {
    return this.productService.findAll(userId);
  }

  @MessagePattern('filterProducts')
  findOne(name: string) {
    return this.productService.filterProducts(name);
  }

  @MessagePattern('productsByPage')
  filterProductsByPage(productDto: FilterProductDto) {
    return this.productService.filterProductsByPage(productDto);
  }
}
