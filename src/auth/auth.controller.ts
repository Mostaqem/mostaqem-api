import {
  Controller,
  Get,
  InternalServerErrorException,
  Res,
  UseGuards,
  Request,
  Post,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { Payload } from './enums/payload.enum';
import type { Response } from 'express';
import { GoogleGuard } from './guards/google.guard';
import { ExchangeDto } from './dto/exchnage.dto';
import { JwtGuard } from './guards/jwt.guard';
import { User } from 'src/user/entities/user.entity';
import { RefreshGuard } from './guards/refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private async exchangeToken(id: string, email: string) {
    try {
      const payload: Payload = { id: id, email };

      const accessToken = this.authService.generateToken('access', payload);
      const refreshToken = this.authService.generateToken('refresh', payload);

      // Set Refresh Token in Cache
      await this.authService.setRefreshToken(email, refreshToken);

      return { accessToken, refreshToken };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  private async handleAuthenticationResponse(
    user: Payload,
    response: Response,
    isRefresh: boolean = false,
  ) {
    try {
      const { accessToken, refreshToken } = await this.exchangeToken(
        user.id,
        user.email,
      );

      if (isRefresh) {
        return {
          accessToken,
          refreshToken,
        };
      }

      const authCode = await this.authService.createTemporaryAuthCode(
        user.email,
        { accessToken, refreshToken },
      );

      const baseUrl = this.configService.get('PUBLIC_URL');
      const redirectUrl = new URL(`${baseUrl}/auth/callback`);
      redirectUrl.searchParams.set('code', authCode);

      response.redirect(redirectUrl.toString());
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  googleLogin() {
    return;
  }

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleCallback(
    @Request() req: { user: Payload },
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.handleAuthenticationResponse(req.user, response);
  }

  @Post('refresh')
  @UseGuards(RefreshGuard)
  async refresh(
    @Request() req: { user: Payload },
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.handleAuthenticationResponse(req.user, response, true);
  }

  @Post('exchange')
  @HttpCode(HttpStatus.OK)
  async exchangeTokenFromAuthCode(@Body() exchangeDto: ExchangeDto) {
    const { code } = exchangeDto;
    const tokens = await this.authService.getTokensFromAuthCode(code);
    return tokens;
  }

  @Get('/me')
  @UseGuards(JwtGuard)
  async me(@Request() req: { user: User }) {
    return req.user;
  }
}
