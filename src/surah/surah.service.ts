import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateSurahDto } from './dto/create-surah.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Surah } from './entities/surah.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class SurahService {
  constructor(
    @InjectRepository(Surah)
    private readonly surahRepository: Repository<Surah>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createSurahDto: CreateSurahDto) {
    const surah = this.surahRepository.create(createSurahDto);
    try {
      return await this.surahRepository.save(surah);
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    const surahCached = await this.cacheManager.get('surah');

    if (surahCached) {
      return surahCached;
    }

    const surah = await this.surahRepository.find();

    const ttl = 12 * 60 * 60 * 1000; // 12 hours

    await this.cacheManager.set('surah', surah, ttl);

    return surah;
  }

  async findOne(id: number) {
    const surah = await this.surahRepository.findOneBy({ id });
    if (!surah) throw new NotFoundException('Surah Not Found');
    return surah;
  }

  async updateSurahImage(id: number, image: string) {
    const surah = await this.surahRepository.findOneBy({ id });
    if (!surah) throw new NotFoundException('Surah Not Found');
    surah.image = image;
    return await this.surahRepository.save(surah);
  }

  async initializeSurah() {
    const surah = await this.surahRepository.find();
    if (surah.length != 114) {
      const data = await require('../../quran.json');
      const seedPromises = data.map(async (surah: any) => {
        const newSurah = this.surahRepository.create({
          id: surah.id,
          name_arabic: surah.name,
          name_complex: surah.transliteration,
          verses_count: surah.total_verses,
          revelation_place: surah.type,
        });
        return this.surahRepository.save(newSurah);
      });
      await Promise.all(seedPromises);
      Logger.log('Surah Seeder Completed');
    }
  }
}
