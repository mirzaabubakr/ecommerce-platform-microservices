import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class UsersService implements OnModuleInit {
  async onModuleInit() {
    this.userClient.subscribeToResponseOf('findAllUsers');
    await this.userClient.connect();
  }

  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientKafka
  ) {}

  async findAll() {
    const users = await this.userClient.send<string>('findAllUsers', {});
    return users;
  }
}
