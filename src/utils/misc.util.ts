import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Tokens } from './../auth/types/token.type';
import { PrismaService } from './../prisma/prisma.service';

@Injectable()
export class MiscUtil {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  static hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  decrytData(data: string, encrypted: string) {
    return bcrypt.compare(data, encrypted);
  }

  verifyToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: process.env.AT_SECRET,
    });
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all([
      await this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          expiresIn: '15m',
          secret: process.env.AT_SECRET,
        },
      ),
      await this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          expiresIn: '7d',
          secret: process.env.RF_SECRET,
        },
      ),
    ]);
    return {
      access_token,
      refresh_token,
    };
  }

  async updateRtHash(id: number, refresh_token: string) {
    const hashRt = await MiscUtil.hashData(refresh_token);
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        hashRt,
      },
    });
  }
}
