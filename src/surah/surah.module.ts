import { Module } from '@nestjs/common';
import { SurahService } from './surah.service';
import { SurahController } from './surah.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Surah } from './entities/surah.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Surah])],
  controllers: [SurahController],
  providers: [SurahService],
})
export class SurahModule {}
