import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ReciterService } from './reciter.service';
import { CreateReciterDto } from './dto/create-reciter.dto';
import { AddImageDto } from './dto/add-image.dto';

@Controller('reciter')
export class ReciterController {
  constructor(private readonly reciterService: ReciterService) {}

  @Post()
  create(@Body() createReciterDto: CreateReciterDto) {
    return this.reciterService.create(createReciterDto);
  }

  @Get()
  findAll() {
    return this.reciterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reciterService.findOne(+id);
  }

  @Patch(':id')
  addSurahImage(@Param('id') id: number, @Body() addImageDto: AddImageDto) {
    return this.reciterService.updateReciterImage(id, addImageDto.image);
  }
}
