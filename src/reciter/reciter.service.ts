import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateReciterDto } from './dto/create-reciter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reciter } from './entities/reciter.entity';
import { Repository } from 'typeorm';
import { Tilawa } from './entities/tilawa.entity';
import { AddTilawaDto } from './dto/add-tilawa.dto';

@Injectable()
export class ReciterService {
  constructor(
    @InjectRepository(Reciter)
    private readonly reciterRepository: Repository<Reciter>,
    @InjectRepository(Tilawa)
    private readonly tilawaRepository: Repository<Tilawa>,
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

  async addDefaultTilawaToReciters(): Promise<void> {
    const tilawa = await this.tilawaRepository.find();

    if (tilawa.length) return;

    const reciters = await this.reciterRepository.find();
    for (const reciter of reciters) {
      const tilawa = this.tilawaRepository.create({
        name: 'حفص عن عاصم - مرتل',
        name_english: "Hafs A'n Assem - Murattal",
        reciter_id: reciter.id,
      });

      await this.tilawaRepository.save(tilawa);
    }
    Logger.log('Default Tilawa added to Reciters');
  }

  async getReciterTilawaId(reciterId: number) {
    const tilawa = await this.tilawaRepository.findOneBy({
      reciter_id: reciterId,
    });
    if (!tilawa) throw new NotFoundException('Tilawa not found');
    return tilawa.id;
  }

  async getReciterTilawa(reciterId: number) {
    const tilawa = await this.tilawaRepository.find({
      where: { reciter_id: reciterId },
    });
    if (!tilawa.length) throw new NotFoundException('Tilawa not found');
    return tilawa;
  }

  addReciterTilawa(id: number, addTilawaDto: Omit<AddTilawaDto, 'reciter_id'>) {
    const tilawa = this.tilawaRepository.create({
      ...addTilawaDto,
      reciter_id: id,
    });
    return this.tilawaRepository.save(tilawa);
  }
}
