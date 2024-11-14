import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

    const result = await this.tilawaSurahRepo.query(
      `SELECT ts.tilawa_id AS tilawa_id, 
      ts.surah_id AS surah_id, 
      ts.url AS url, 
      r.name_english AS reciter_name_english, 
      r.name_arabic AS reciter_name_arabic,  
      s.name_arabic AS surah_name_arabic,  
      s.name_complex AS surah_name_complex,
      s.image AS surah_image
      FROM tilawa_surah ts
      LEFT JOIN tilawa t ON t.id = ts.tilawa_id
      INNER JOIN reciter r ON r.id = t.reciter_id
      LEFT JOIN surah s ON s.id = ts.surah_id
      WHERE ts.surah_id = ? AND ts.tilawa_id = ?;`,
      [surah_id, tilawa_id],
    );

    if (!result.length) {
      throw new NotFoundException('Audio not found');
    }

    const audio = {
      tilawa_id,
      url: result[0].url,
      surah: {
        name_arabic: result[0].surah_name_arabic,
        name_complex: result[0].surah_name_complex,
        image: result[0].surah_image,
      },
      reciter: {
        name_arabic: result[0].reciter_name_arabic,
        name_english: result[0].reciter_name_english,
      },
    };

    return audio;
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
