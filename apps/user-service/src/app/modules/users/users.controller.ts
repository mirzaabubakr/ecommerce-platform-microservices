import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto, UserTokenDto } from './dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('createUser')
  create(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern('findAllUsers')
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern('findUserByEmail')
  findUserByEmail(email: string) {
    return this.usersService.findUserByEmail(email);
  }

  @MessagePattern('findUserById')
  findUserById(id: string) {
    return this.usersService.findUserById(id);
  }

  @MessagePattern('updateRefreshToken')
  updateToken(userTokenDto: UserTokenDto) {
    return this.usersService.updateToken(userTokenDto);
  }
}
