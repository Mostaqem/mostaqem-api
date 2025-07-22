import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Surah } from '../surah/entities/surah.entity';
import { Mood } from '../surah/enums/mood.enum';
import * as moodData from './data/mood.json';

@Injectable()
export class ScriptService {
  constructor(
    @InjectRepository(Surah)
    private surahRepository: Repository<Surah>,
  ) {}

  async addMoodToSurah() {
    const surahs = await this.surahRepository.find();

    for (const [mood, surahIds] of Object.entries(moodData)) {
      const moodEnum = mood.toUpperCase() as keyof typeof Mood;

      for (const surahId of surahIds) {
        const surah = surahs.find((s) => s.id === surahId);

        if (surah && !surah.mood) {
          surah.mood = Mood[moodEnum];
          await this.surahRepository.save(surah);
          console.log(`Added mood ${mood} to surah ${surahId}`);
        }
      }
    }

    console.log('Mood assignment completed');
  }
}
