import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AudioService } from './audio.service';
import { CreateAudioDto } from './dto/create-audio.dto';
import { FilterAudioDto } from './dto/filter-audio.dto';
import { FilterAudioLrcDto } from './dto/filter-lrc.dto';
import { RandomDto } from './dto/random.dto';

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
