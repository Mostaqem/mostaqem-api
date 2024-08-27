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

const DEFAULT_TILAWA = 'حفص عن عاصم - مرتل';
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

  async getAudio(
    paginatedFilter: FilterAudioDto,
  ): Promise<TilawaSurah & { reciter_id: number }> {
    const { surah_id, reciter_id } = paginatedFilter;
    let tilawa_id = paginatedFilter.tilawa_id;

    if (!reciter_id && !tilawa_id)
      throw new ConflictException('Reciter or Tilawa are required');

    if (!tilawa_id) {
      const tilawa = await this.reciterService.getReciterTilawa(reciter_id);
      const defaultTilawa = tilawa.find((t) => t.name == DEFAULT_TILAWA);
      tilawa_id = defaultTilawa.id;
    }

    const audio = await this.tilawaSurahRepo.findOne({
      where: { surah_id, tilawa_id },
    });

    if (!audio) {
      throw new NotFoundException('Audio not found');
    }
    return { ...audio, reciter_id };
  }

  // async createAudioSeeder() {
  //   const audio = await this.tilawaSurahRepo.find();

  //   if (audio.length) return;

  //   const audioData = await require('../../data/tilawa-surah.json');

  //   for (const audio of audioData) {
  //     const newAudio = this.tilawaSurahRepo.create({
  //       surah_id: audio.surah_id,
  //       tilawa_id: audio.tilawa_id,
  //       audio_url: audio.audio_url,
  //     });
  //     await this.tilawaSurahRepo.save(newAudio);
  //   }
  // }
}
