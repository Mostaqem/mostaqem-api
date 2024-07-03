import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AudioService } from './audio.service';
import { CreateAudioDto } from './dto/create-audio.dto';
import { FilterAudioDto } from './dto/filter-audio.dto';

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
}
