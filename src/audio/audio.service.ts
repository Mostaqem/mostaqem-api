import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TilawaSurah } from 'src/surah/entities/tilawa-surah.entity';
import { Repository } from 'typeorm';
import { CreateAudioDto } from './dto/create-audio.dto';
import { FilterAudioDto } from './dto/filter-audio.dto';
import { ReciterService } from 'src/reciter/reciter.service';
import { FilterAudioLrcDto } from './dto/filter-lrc.dto';

@Injectable()
export class AudioService {
  constructor(
    @InjectRepository(TilawaSurah)
    private readonly tilawaSurahRepo: Repository<TilawaSurah>,
    private readonly reciterService: ReciterService,
  ) {}

  create(createAudioDto: CreateAudioDto) {
    const audio = this.tilawaSurahRepo.create(createAudioDto);

    return this.tilawaSurahRepo.save(audio);
  }

  async getAudio(paginatedFilter: FilterAudioDto) {
    const { surah_id, reciter_id } = paginatedFilter;
    let tilawa_id = paginatedFilter.tilawa_id;

    if (!reciter_id && !tilawa_id)
      throw new ConflictException('Reciter or Tilawa are required');

    if (!tilawa_id) {
      const tilawa = await this.reciterService.getReciterTilawa(reciter_id);
      tilawa_id = tilawa[0].id;
    }

    const audio = await this.tilawaSurahRepo.find({
      select: ['tilawa_id', 'url'],
      where: {
        surah_id,
        tilawa_id,
      },
      relations: {
        surah: true,
        tilawa: {
          reciter: true,
        },
      },
    });

    return audio[0];
  }

  getAudioLrc(filterAudioLrcDto: FilterAudioLrcDto) {
    return this.tilawaSurahRepo.findOne({
      select: ['lrc_content'],
      where: {
        surah_id: filterAudioLrcDto.surah_id,
        tilawa_id: filterAudioLrcDto.tilawa_id,
      },
    });
  }
}
