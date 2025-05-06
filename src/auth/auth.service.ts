import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Payload } from './enums/payload.enum';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  generateToken(grantType: 'access' | 'refresh', payload?: Payload) {
    switch (grantType) {
      case 'access': {
        if (!payload)
          throw new InternalServerErrorException('InvalidTokenPayload');
        return this.jwtService.sign(payload, {
          secret: this.configService.getOrThrow('ACCESS_TOKEN_SECRET'),
          expiresIn: '15m', // 15 minutes
        });
      }

      case 'refresh': {
        if (!payload)
          throw new InternalServerErrorException('InvalidTokenPayload');
        return this.jwtService.sign(payload, {
          secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
          expiresIn: '2d', // 2 days
        });
      }
    }
  }

  async setRefreshToken(email: string, refreshToken: string) {
    await this.cacheManager.set(email, refreshToken, 1000 * 60 * 60 * 24 * 2); // 2 days in milliseconds
  }

  async validateRefreshToken(payload: Payload, token: string) {
    const storedRefreshToken = await this.cacheManager.get(payload.email);
    const user = await this.userService.findById(payload.id);

    if (!user || !storedRefreshToken || storedRefreshToken !== token)
      throw new ForbiddenException();

    return user;
  }

  async createTemporaryAuthCode(
    email: string,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    const crypto = require('crypto');
    const authCode = crypto.randomBytes(16).toString('hex');
    await this.cacheManager.set(authCode, tokens, 1000 * 60 * 5); // 5 minutes in milliseconds
    return authCode;
  }

  async getTokensFromAuthCode(authCode: string) {
    const tokens: { accessToken: string; refreshToken: string } =
      await this.cacheManager.get(authCode);
    if (!tokens) throw new ForbiddenException('Invalid auth code');
    return tokens;
  }
}
