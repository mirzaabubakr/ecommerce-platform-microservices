import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { FilterProductDto } from './dto/filter-products.dto';

@Injectable()
export class ProductService {
  async onModuleInit() {
    this.productClient.subscribeToResponseOf('createProduct');
    this.productClient.subscribeToResponseOf('userAllProducts');
    this.productClient.subscribeToResponseOf('filterProducts');
    this.productClient.subscribeToResponseOf('productsByPage');

    await this.productClient.connect();
  }
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly productClient: ClientKafka
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = await lastValueFrom(
      this.productClient.send('createProduct', createProductDto)
    );
    return product;
  }

  async findAll(userId: number) {
    const products = await lastValueFrom(
      this.productClient.send('userAllProducts', userId)
    );
    return products;
  }

  async filterProductsByName(name: string) {
    const products = await lastValueFrom(
      this.productClient.send('filterProducts', name)
    );
    return products;
  }

  async filterProductsByPage(productDto: FilterProductDto) {
    try {
      const products = await lastValueFrom(
        this.productClient.send('productsByPage', productDto)
      );

      return products;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
