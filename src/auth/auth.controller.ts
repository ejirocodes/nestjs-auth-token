import { Tokens } from './types';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() user: AuthDto): Promise<Tokens> {
    this.authService.signup(user);
    return 'signup';
  }

  @Post('login')
  async login() {
    this.authService.login();
    return 'login';
  }

  @Post('logout')
  async logout() {
    this.authService.logout();
    return 'logout';
  }

  @Post('refresh')
  async refreshToken() {
    this.authService.refreshToken();
    return 'refresh';
  }
}
