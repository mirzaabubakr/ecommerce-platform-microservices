import { ConfigService } from '@nestjs/config';
import { Product } from '../../app/modules/product/entities/product.entity';
import { UserProduct } from '../../app/modules/product/entities/user-product.entity';

export const getOrmConfig = (configService: ConfigService) => ({
  type: configService.get('DB_TYPE'),
  host: configService.get('DB_HOST'),
  port: +configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DATABASE_PRODUCT'),
  connectTimeout: 60000,
  entities: [Product, UserProduct],
  logging: true,
  synchronize: true,
});
