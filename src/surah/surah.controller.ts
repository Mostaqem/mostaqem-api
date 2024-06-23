import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { SurahService } from './surah.service';
import { CreateSurahDto } from './dto/create-surah.dto';
import { AddImageDto } from './dto/add-image.dto';

@Controller('surah')
export class SurahController {
  constructor(private readonly surahService: SurahService) {}

  @Post()
  create(@Body() createSurahDto: CreateSurahDto) {
    return this.surahService.create(createSurahDto);
  }

  @Get()
  findAll() {
    return this.surahService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.surahService.findOne(+id);
  }

  @Patch(':id')
  addSurahImage(@Param('id') id: number, @Body() addImageDto: AddImageDto) {
    return this.surahService.updateSurahImage(id, addImageDto.image);
  }
}
