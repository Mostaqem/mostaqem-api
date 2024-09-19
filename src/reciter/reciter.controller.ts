import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Headers,
  Query,
} from '@nestjs/common';
import { ReciterService } from './reciter.service';
import { CreateReciterDto } from './dto/create-reciter.dto';
import { AddImageDto } from './dto/add-image.dto';
import { AddTilawaDto } from './dto/add-tilawa.dto';
import { ReciterFilterDto } from './dto/reciter-filter.dto';

@Controller('reciter')
export class ReciterController {
  constructor(private readonly reciterService: ReciterService) {}

  @Post()
  create(@Body() createReciterDto: CreateReciterDto) {
    return this.reciterService.create(createReciterDto);
  }

  @Get()
  findAll(
    @Headers('Accept-Language') lang: 'eng' | 'ar',
    @Query() reciterFilterDto: ReciterFilterDto,
  ) {
    return this.reciterService.findAll(lang, reciterFilterDto);
  }

  @Post('/:id/tilawa')
  addReciterTilawa(
    @Param('id') id: number,
    @Body() addTilawaDto: AddTilawaDto,
  ) {
    return this.reciterService.addReciterTilawa(id, addTilawaDto);
  }

  @Get('/:id/tilawa')
  getReciterTilawa(@Param('id') id: number) {
    return this.reciterService.getReciterTilawa(id);
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
