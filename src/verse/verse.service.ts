import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateVerseDto } from './dto/create-verse.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Verse } from './entities/verse.entity';
import { Repository } from 'typeorm';
import { randomInt } from 'node:crypto';

@Injectable()
export class VerseService {
  constructor(
    @InjectRepository(Verse)
    private readonly verseRepository: Repository<Verse>,
  ) {}

  create(createVerseDto: CreateVerseDto) {
    const verse = this.verseRepository.create(createVerseDto);
    try {
      return this.verseRepository.save(verse);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getSurahVerses(surah_id: number) {
    const verses = await this.verseRepository.find({
      where: { surah_id },
    });
    const result = {
      verses,
      totalVerseNumber: verses.length,
    };
    return result;
  }

  async initialVerses() {
    const verses = await this.verseRepository.find();
    const data = await require('../../quran.json');
    if (verses.length === 0) {
      for (let i = 0; i < data.length; i++) {
        const surah = data[i];
        for (let j = 0; j < surah.verses.length; j++) {
          const verse = surah.verses[j];
          const newVerse = this.verseRepository.create({
            surah_id: surah.id,
            verse_number: verse.id,
            vers: verse.text,
            vers_lang: 'ar',
          });
          await this.verseRepository.save(newVerse);
        }
      }
      Logger.log('Verse Seeder Completed');
    }
    return;
  }

  async getRandomVerse() {
    const id = randomInt(1, 6236 + 1);
    const verse = await this.verseRepository.findOne({ where: { id } });

    return verse;
  }
}
