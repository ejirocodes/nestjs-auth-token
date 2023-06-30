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
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

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

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request & { user: { sub: number } }) {
    const user = req.user;
    return this.authService.logout(user.sub);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: Request & { user: { sub: number; refreshToken: string } },
  ) {
    const user = req.user;
    return this.authService.refreshToken(user.sub, user.refreshToken);
  }
}
