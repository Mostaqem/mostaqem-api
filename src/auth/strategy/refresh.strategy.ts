import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '../auth.service';
import { Payload } from '../enums/payload.enum';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const extractors = [
      (request: Request) => {
        return request.body.refreshToken;
      },
    ];

    super({
      secretOrKey: configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors(extractors),
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate(request: Request, payload: Payload) {
    const refreshToken = request.body.refreshToken;

    return this.authService.validateRefreshToken(payload, refreshToken);
  }
}
