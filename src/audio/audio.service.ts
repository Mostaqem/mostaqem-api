import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReciterSurah } from 'src/surah/entities/reciter-surah.entity';
import { Repository } from 'typeorm';
import { CreateAudioDto } from './dto/create-audio.dto';
import { FilterAudioDto } from './dto/filter-audio.dto';
// import axios from 'axios';

@Injectable()
export class AudioService {
  constructor(
    @InjectRepository(ReciterSurah)
    private readonly reciterSurahRepo: Repository<ReciterSurah>,
  ) {}

  create(createAudioDto: CreateAudioDto) {
    const audio = this.reciterSurahRepo.create(createAudioDto);

    return this.reciterSurahRepo.save(audio);
  }

  async getAudio(paginatedFilter: FilterAudioDto) {
    const { surah_id, reciter_id } = paginatedFilter;
    const audio = await this.reciterSurahRepo.findOne({
      where: { surah_id, reciter_id },
    });
    if (!audio) {
      throw new NotFoundException('Audio not found');
    }
    return audio;
  }
}
