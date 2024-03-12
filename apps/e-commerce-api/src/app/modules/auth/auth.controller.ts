import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types';
import { GetCurrentUserId } from '../../common/decorators/get-current-user-id.decorator';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import { RtGuard } from '../../common/guards/rt.guard';
import { Public } from '../../common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  userSignup(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.userSignup(dto);
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  userSignin(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.userSignin(dto);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
