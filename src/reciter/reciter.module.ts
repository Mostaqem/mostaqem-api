import { Module } from '@nestjs/common';
import { ReciterService } from './reciter.service';
import { ReciterController } from './reciter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reciter } from './entities/reciter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reciter])],
  controllers: [ReciterController],
  providers: [ReciterService],
})
export class ReciterModule {}
