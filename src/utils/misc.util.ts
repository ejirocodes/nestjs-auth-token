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

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
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
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async updateRtHash(id: number, refreshToken: string) {
    const hashRt = await MiscUtil.hashData(refreshToken);
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
