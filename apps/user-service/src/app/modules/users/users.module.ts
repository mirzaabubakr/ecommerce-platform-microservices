import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RolesEntity } from './entities/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RolesEntity])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
