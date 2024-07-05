import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReciterDto } from './dto/create-reciter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reciter } from './entities/reciter.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReciterService {
  constructor(
    @InjectRepository(Reciter)
    private readonly reciterRepository: Repository<Reciter>,
  ) {}
  create(createReciterDto: CreateReciterDto) {
    const reciter = this.reciterRepository.create(createReciterDto);
    return this.reciterRepository.save(reciter);
  }

  findAll(orderBy: 'eng' | 'ar') {
    const orderOptions: { name_english?: 'ASC'; name_arabic?: 'ASC' } = {};

    if (orderBy === 'eng') {
      orderOptions.name_english = 'ASC';
    } else if (orderBy === 'ar') {
      orderOptions.name_arabic = 'ASC';
    }
    return this.reciterRepository.find({
      order: orderOptions,
    });
  }

  async findOne(id: number) {
    const reciter = await this.reciterRepository.findOneBy({ id });
    if (!reciter) throw new NotFoundException('Reciter not found');
    return reciter;
  }

  async updateReciterImage(id: number, image: string) {
    const surah = await this.reciterRepository.findOneBy({ id });
    if (!surah) throw new NotFoundException('Reciter Not Found');
    surah.image = image;
    return await this.reciterRepository.save(surah);
  }
}
