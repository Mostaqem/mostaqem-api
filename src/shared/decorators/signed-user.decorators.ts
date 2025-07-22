import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { Payload } from 'src/auth/enums/payload.enum';
import { User } from 'src/user/entities/user.entity';

export const SignedUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as Payload;
    return data ? user[data] : user;
  },
);
