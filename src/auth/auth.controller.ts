import { Tokens } from './types';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Request } from 'express';
import { AccessTokenGuard, RefreshTokenGuard } from './common/guards';
import { GetCurrentUserId } from './common/decorators/get-current-user-id.decorator';
import { GetCurrentUser } from './common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() user: AuthDto): Promise<Tokens> {
    return this.authService.signup(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() user: AuthDto): Promise<Tokens> {
    return this.authService.login(user);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refresh_token') refreshToken: string,
  ) {
    return this.authService.refreshToken(userId, refreshToken);
  }
}
