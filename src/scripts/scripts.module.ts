import { Module } from '@nestjs/common';
import { ScriptService } from './script-service.service';
import { Surah } from 'src/surah/entities/surah.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Surah])],
  providers: [ScriptService],
  exports: [ScriptService],
})
export class ScriptsModule {}
