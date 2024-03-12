import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../../app/modules/users/entities/user.entity';
import { RolesEntity } from '../../app/modules/users/entities/roles.entity';

export const getOrmConfig = (configService: ConfigService) => ({
  type: configService.get('DB_TYPE'),
  host: configService.get('DB_HOST'),
  port: +configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DATABASE_USER'),
  connectTimeout: 60000,
  entities: [UserEntity, RolesEntity],
  logging: true,
  synchronize: true,
});
