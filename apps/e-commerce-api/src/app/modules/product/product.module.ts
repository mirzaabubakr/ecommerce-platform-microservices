import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
dotenv.config();
const {  KAFKAJS_CLIENT_BROKER_URL } = process.env;

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'product',
            brokers: [KAFKAJS_CLIENT_BROKER_URL],
          },
          consumer: {
            groupId: 'product-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
