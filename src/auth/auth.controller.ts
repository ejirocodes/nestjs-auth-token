import { Tokens } from './types';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() user: AuthDto): Promise<Tokens> {
    return this.authService.signup(user);
  }

  @Post('login')
  async login(@Body() user: AuthDto): Promise<Tokens> {
    return this.authService.login(user);
  }

  @Post('logout')
  async logout() {
    return this.authService.logout();
  }

  @Post('refresh')
  async refreshToken() {
    return this.authService.refreshToken();
  }
}
