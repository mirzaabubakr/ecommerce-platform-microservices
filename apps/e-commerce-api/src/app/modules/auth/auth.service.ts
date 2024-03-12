import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { ClientKafka } from '@nestjs/microservices';
import { JwtPayload, Tokens } from './types';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { lastValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
    private jwtService: JwtService,
    private config: ConfigService
  ) {}

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('createUser');
    this.authClient.subscribeToResponseOf('findUserByEmail');
    this.authClient.subscribeToResponseOf('findUserById');
    this.authClient.subscribeToResponseOf('updateRefreshToken');
    await this.authClient.connect();
  }

  async userSignup(dto: AuthDto): Promise<Tokens> {
    try {
      const user = await lastValueFrom(this.authClient.send('createUser', dto));
      const tokens = await this.getTokens(
        user.user.id,
        user.user.email,
        user.user.role ? user.user.role : 2
      );
      await this.updateRtHash(user.user.id, tokens.refresh_token);

      return tokens;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async userSignin(dto: AuthDto): Promise<Tokens> {
    const { email, password } = dto;
    const user = await lastValueFrom(
      this.authClient.send('findUserByEmail', email)
    );

    if (!user.user) throw new ForbiddenException('Access Denied');
    const passwordMatches = await bcrypt.compare(password, user.user.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(
      user.user.id,
      user.user.email,
      user.user.role.id
    );
    await this.updateRtHash(user.user.id, tokens.refresh_token);
    return tokens;
  }

  async getTokens(
    userId: number,
    email: string,
    roleId: number
  ): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
      roleId: roleId,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('AT_SECRET'),
        expiresIn: '30m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await lastValueFrom(
      this.authClient.send('findUserById', userId)
    );
    if (!user.user || !user.user.refreshToken)
      throw new ForbiddenException('Access Denied');
    if (user.user.refreshToken !== rt)
      throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(
      user.user.id,
      user.user.email,
      user.user.role.id
    );
    await this.updateRtHash(user.user.id, tokens.refresh_token);
    return tokens;
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    this.authClient.emit('updateRefreshToken', {
      id: userId,
      token: rt,
    });
  }
}
