import { Module } from '@nestjs/common';
import { ReciterService } from './reciter.service';
import { ReciterController } from './reciter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reciter } from './entities/reciter.entity';
import { Tilawa } from './entities/tilawa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reciter, Tilawa])],
  controllers: [ReciterController],
  providers: [ReciterService],
  exports: [ReciterService],
})
export class ReciterModule {
  constructor(private readonly reciterService: ReciterService) {}
  onModuleInit() {
    this.reciterService.addDefaultTilawaToReciters();
  }
}
