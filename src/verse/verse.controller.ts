import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { VerseService } from './verse.service';
import { CreateVerseDto } from './dto/create-verse.dto';
import { GetVerseFilterDto } from './dto/filter-get-verse.dto';

@Controller('verse')
export class VerseController {
  constructor(private readonly verseService: VerseService) {}

  @Post()
  create(@Body() createVerseDto: CreateVerseDto) {
    return this.verseService.create(createVerseDto);
  }

  @Get('/surah')
  getSurahVerses(@Query() getVerseFilterDto: GetVerseFilterDto) {
    return this.verseService.getSurahVerses(getVerseFilterDto.surah_id);
  }
}
