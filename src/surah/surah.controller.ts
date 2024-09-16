import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { SurahService } from './surah.service';
import { CreateSurahDto } from './dto/create-surah.dto';
import { AddImageDto } from './dto/add-image.dto';
import { SurahFilterDto } from './dto/surah-filter.dto';

@Controller('surah')
export class SurahController {
  constructor(private readonly surahService: SurahService) {}

  @Post()
  create(@Body() createSurahDto: CreateSurahDto) {
    return this.surahService.create(createSurahDto);
  }

  @Get()
  findAll(@Query() surahFilterDto: SurahFilterDto) {
    return this.surahService.findAll(surahFilterDto);
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
