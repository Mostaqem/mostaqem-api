import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AudioController } from './audio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TilawaSurah } from 'src/surah/entities/tilawa-surah.entity';
import { ReciterModule } from 'src/reciter/reciter.module';

@Module({
  imports: [TypeOrmModule.forFeature([TilawaSurah]), ReciterModule],
  controllers: [AudioController],
  providers: [AudioService],
})
export class AudioModule {}
