import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UserProduct } from './entities/user-product.entity';
import { FilterProductDto } from './dto/filter-products.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(UserProduct)
    private upRepository: Repository<UserProduct>
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { productName, productPrice, userId } = createProductDto;
    const newProduct = new Product();
    newProduct.ProductName = productName;
    newProduct.Price = productPrice;
    const product = await this.productRepository.save(newProduct);

    await this.createUserProduct(userId, product.ProductID);
    return { status: HttpStatus.CREATED, message: 'Product Created', product };
  }

  async createUserProduct(userId: number, productId: number) {
    const newUProduct = new UserProduct();
    newUProduct.product = productId;
    newUProduct.userId = userId;

    await this.upRepository.save(newUProduct);

    return { status: HttpStatus.CREATED };
  }

  async findAll(userId: number) {
    const products = await this.upRepository
      .createQueryBuilder('up')
      .select('product.*')
      .leftJoin('up.product', 'product')
      .where('up.userId = :userId', { userId: userId })
      .orderBy('product.Price', 'ASC')
      .getRawMany();

    return { status: HttpStatus.OK, message: 'Products', products };
  }

  async filterProducts(name: string) {
    const productName = name.toLowerCase();

    const products = await this.upRepository
      .createQueryBuilder('up')
      .select('product.*')
      .leftJoin('up.product', 'product')
      .where('LOWER(product.ProductName) LIKE :name', {
        name: `%${productName}%`,
      })
      .orderBy('product.Price', 'ASC')
      .getRawMany();

    return { status: HttpStatus.OK, products };
  }

  async filterProductsByPage(productDto: FilterProductDto) {
    try {
      const { page, pageSize, sortOrder } = productDto;

      const productsQuery = this.upRepository
        .createQueryBuilder('up')
        .leftJoinAndSelect('up.product', 'product')
        .orderBy('product.Price', sortOrder);

      const products = await productsQuery
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getMany();

      const totalCount = await productsQuery.getCount();
      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        status: HttpStatus.OK,
        products,
        totalCount,
        page,
        pageSize,
        totalPages,
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }
}
