import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AdminStrategy, AtStrategy, RtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();
const { AT_SECRET, KAFKAJS_CLIENT_BROKER_URL } = process.env;

@Module({
  imports: [
    JwtModule.register({
      secret: AT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth',
            brokers: [KAFKAJS_CLIENT_BROKER_URL],
          },
          consumer: {
            groupId: 'auth-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AtStrategy,
    AdminStrategy,
    RtStrategy,
    ConfigService,
  ],
})
export class AuthModule {}
