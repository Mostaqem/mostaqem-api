import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateVerseDto } from './dto/create-verse.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Verse } from './entities/verse.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VerseService {
  constructor(
    @InjectRepository(Verse)
    private readonly verseSRepository: Repository<Verse>,
  ) {}

  create(createVerseDto: CreateVerseDto) {
    const verse = this.verseSRepository.create(createVerseDto);
    try {
      return this.verseSRepository.save(verse);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getSurahVerses(surah_id: number) {
    const verses = await this.verseSRepository.find({
      where: { surah_id },
    });
    const result = {
      verses,
      totalVerseNumber: verses.length,
    };
    return result;
  }

  async initialVerses() {
    const verses = await this.verseSRepository.find();
    const data = await require('../../quran.json');
    if (verses.length === 0) {
      for (let i = 0; i < data.length; i++) {
        const surah = data[i];
        for (let j = 0; j < surah.verses.length; j++) {
          const verse = surah.verses[j];
          const newVerse = this.verseSRepository.create({
            surah_id: surah.id,
            verse_number: verse.id,
            vers: verse.text,
            vers_lang: 'ar',
          });
          await this.verseSRepository.save(newVerse);
        }
      }
      Logger.log('Verse Seeder Completed');
    }
    return;
  }
}
