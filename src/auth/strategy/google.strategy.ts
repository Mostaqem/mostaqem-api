import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    readonly clientID: string,
    readonly clientSecret: string,
    readonly callbackURL: string,
    private readonly userService: UserService,
  ) {
    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { displayName, emails, username } = profile;

    const email = (
      emails?.[0].value ?? `${username}@google.com`
    ).toLocaleLowerCase();

    let user: User | null = null;

    if (!email) throw new BadRequestException("Couldn't get email from Google");

    try {
      user = await this.userService.findByEmail(email);

      if (!user) throw new BadRequestException('User not found');

      done(null, user);
    } catch {
      try {
        user = await this.userService.create({
          email,
          name: displayName,
        });

        done(null, user);
      } catch (error) {
        Logger.error(error);

        throw new BadRequestException("Couldn't create user");
      }
    }
  }
}
