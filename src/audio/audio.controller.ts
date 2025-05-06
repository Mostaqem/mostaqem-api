import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AudioService } from './audio.service';
import { CreateAudioDto } from './dto/create-audio.dto';
import { FilterAudioDto } from './dto/filter-audio.dto';
import { FilterAudioLrcDto } from './dto/filter-lrc.dto';
import { RandomDto } from './dto/random.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { SigendUser } from 'src/shared/decorators/signed-user.decorators';
import { User } from 'src/user/entities/user.entity';

@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Post()
  create(@Body() createAudioDto: CreateAudioDto) {
    return this.audioService.create(createAudioDto);
  }

  @Get()
  get(@Query() paginatedFilter: FilterAudioDto) {
    return this.audioService.getAudio(paginatedFilter);
  }

  @Get('/:surah')
  @UseGuards(JwtGuard)
  getBySurah(@Param('surah') surah: string, @SigendUser() user: User) {
    return this.audioService.getAudioBySurah(+surah, user.default_tilawa_id);
  }

  @Get('lrc')
  getLrc(@Query() filterAudioLrcDto: FilterAudioLrcDto) {
    return this.audioService.getAudioLrc(filterAudioLrcDto);
  }

  @Get('/random')
  getRandom(@Query() randomDto: RandomDto) {
    return this.audioService.getRandomAudio(
      randomDto.limit,
      randomDto.reciter_id,
    );
  }
}
