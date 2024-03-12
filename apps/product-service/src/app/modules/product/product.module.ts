import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { UserProduct } from './entities/user-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, UserProduct])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
