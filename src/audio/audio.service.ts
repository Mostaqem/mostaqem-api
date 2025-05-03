import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TilawaSurah } from 'src/surah/entities/tilawa-surah.entity';
import { In, Repository } from 'typeorm';
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

  async getRandomAudio(limit: number, reciter_id: number) {
    if (limit < 1) {
      throw new Error('Limit must be greater than 0');
    }

    const randomTilawa = await this.reciterService.getRandomTilawa(reciter_id);

    const audioRecords = await this.tilawaSurahRepo.find({
      select: ['tilawa_id', 'url'],
      where: {
        tilawa_id: In(randomTilawa.map((tilawa) => tilawa.id)),
      },
      relations: {
        surah: true,
        tilawa: {
          reciter: true,
        },
      },
    });

    if (!audioRecords?.length) {
      return [];
    }

    // Use Fisher-Yates shuffle algorithm for randomization
    for (let i = audioRecords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [audioRecords[i], audioRecords[j]] = [audioRecords[j], audioRecords[i]];
    }

    return audioRecords.slice(0, Math.min(limit, audioRecords.length));
  }
}
