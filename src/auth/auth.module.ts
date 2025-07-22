import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { GoogleStrategy } from './strategy/google.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RefreshStrategy } from './strategy/refresh.strategy';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    JwtStrategy,
    RefreshStrategy,
    {
      provide: GoogleStrategy,
      inject: [ConfigService, UserService],
      useFactory: (configService: ConfigService, userService: UserService) => {
        const clientID = configService.getOrThrow('GOOGLE_CLIENT_ID');
        const clientSecret = configService.getOrThrow('GOOGLE_CLIENT_SECRET');
        const callbackURL = configService.getOrThrow('GOOGLE_CALLBACK_URL');

        return new GoogleStrategy(
          clientID,
          clientSecret,
          callbackURL,
          userService,
        );
      },
    },
  ],
})
export class AuthModule {}
