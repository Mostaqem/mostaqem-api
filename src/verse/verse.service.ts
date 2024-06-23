import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
}
