import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserPreferencesDto } from './dto/user-preferences.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { SigendUser } from 'src/shared/decorators/signed-user.decorators';
import { User } from './entities/user.entity';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('preferences')
  getUserPreferences(@SigendUser() user: User) {
    return this.userService.getUserWithPreferences(user.id);
  }

  @Patch('preferences')
  updateUserPreferences(
    @SigendUser() user: User,
    @Body() preferences: UserPreferencesDto,
  ) {
    return this.userService.updateUserPreferences(user.id, preferences);
  }
}
