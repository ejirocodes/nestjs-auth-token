import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { MiscUtil } from '../utils/misc.util';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private miscUtil: MiscUtil) {}

  async signup(authData: AuthDto): Promise<Tokens> {
    const hashPassword = await MiscUtil.hashData(authData.password);

    const user = await this.prisma.user.create({
      data: {
        email: authData.email,
        hash: hashPassword,
      },
    });
    const tokens = await this.miscUtil.getTokens(user.id, user.email);
    await this.miscUtil.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async login(authData: AuthDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: authData.email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await this.miscUtil.decrytData(
      authData.password,
      user.hash,
    );
    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid password');
    }
    const tokens = await this.miscUtil.getTokens(user.id, user.hashRt);
    await this.miscUtil.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout() {
    return 'logout';
  }

  async refreshToken() {
    return 'refresh';
  }
}
