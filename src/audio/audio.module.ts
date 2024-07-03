import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AudioController } from './audio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReciterSurah } from 'src/surah/entities/reciter-surah.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReciterSurah])],
  controllers: [AudioController],
  providers: [AudioService],
})
export class AudioModule {}
