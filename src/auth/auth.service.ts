import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { hashData } from '../utils/misc.util';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(authData: AuthDto): Promise<Tokens> {
    const hashPassword = await hashData(authData.password);

    const user = await this.prisma.user.create({
      data: {
        email: authData.email,
        hash: hashPassword,
      },
    });
    return 'signup';
  }

  async login() {
    return 'login';
  }

  async logout() {
    return 'logout';
  }

  async refreshToken() {
    return 'refresh';
  }
}
