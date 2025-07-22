import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { type Payload } from 'src/auth/enums/payload.enum';
import { SignedUser } from 'src/shared/decorators/signed-user.decorators';

@Controller('favorites')
@UseGuards(JwtGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  create(
    @Body() createFavoriteDto: CreateFavoriteDto,
    @SignedUser() user: Payload,
  ) {
    // Override user_id from token
    createFavoriteDto.user_id = user.id;
    return this.favoritesService.create(createFavoriteDto);
  }

  @Get()
  findAll(@SignedUser() user: Payload) {
    return this.favoritesService.findAll(user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favoritesService.remove(id);
  }
}
