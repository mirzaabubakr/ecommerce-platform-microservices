import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UsersService } from './app/modules/users/users.service';
import * as dotenv from 'dotenv';
dotenv.config();
const { KAFKAJS_CLIENT_BROKER_URL } = process.env;

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [KAFKAJS_CLIENT_BROKER_URL],
        },
        consumer: {
          groupId: 'user-consumer',
        },
      },
    }
  );

  const roleService = app.get(UsersService);
  await roleService.createDefaultRoles();

  await app.listen();
}

bootstrap();
