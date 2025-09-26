import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateReciterDto } from './dto/create-reciter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reciter } from './entities/reciter.entity';
import { In, Repository } from 'typeorm';
import { Tilawa } from './entities/tilawa.entity';
import { Tag } from './entities/tag.entity';
import { AddTilawaDto } from './dto/add-tilawa.dto';
import { ReciterFilterDto } from './dto/reciter-filter.dto';

@Injectable()
export class ReciterService {
  private readonly logger = new Logger(ReciterService.name);
  constructor(
    @InjectRepository(Reciter)
    private readonly reciterRepository: Repository<Reciter>,
    @InjectRepository(Tilawa)
    private readonly tilawaRepository: Repository<Tilawa>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  create(createReciterDto: CreateReciterDto) {
    const reciter = this.reciterRepository.create(createReciterDto);
    return this.reciterRepository.save(reciter);
  }

  async findAll(orderBy: 'eng' | 'ar', reciterFilterDto: ReciterFilterDto) {
    const { take, page, name, category, region, is_featured, tags } =
      reciterFilterDto;
    const skip = take * (page - 1);

    const query = this.reciterRepository
      .createQueryBuilder('reciter')
      .leftJoinAndSelect('reciter.tags', 'tag')
      .where('1 = 1');

    if (orderBy === 'eng') {
      query.orderBy('reciter.name_english', 'ASC');
    } else if (orderBy === 'ar') {
      query.orderBy('reciter.name_arabic', 'ASC');
    }

    if (name) {
      query.andWhere(
        'MATCH(reciter.name_arabic) AGAINST(:name IN NATURAL LANGUAGE MODE)',
        { name },
      );
      query.orWhere(
        'MATCH(reciter.name_english) AGAINST(:name IN NATURAL LANGUAGE MODE)',
        { name },
      );
    }

    if (category) {
      query.andWhere('reciter.category = :category', { category });
    }

    if (region) {
      query.andWhere('reciter.region = :region', { region });
    }

    if (is_featured !== undefined) {
      query.andWhere('reciter.is_featured = :is_featured', { is_featured });
    }

    if (tags && tags.length > 0) {
      query.andWhere(
        'tag.name_arabic IN (:...tags) OR tag.name_english IN (:...tags)',
        { tags },
      );
      query.groupBy('reciter.id');
      query.having('COUNT(DISTINCT tag.id) >= :tagCount', {
        tagCount: tags.length,
      });
    }

    const [reciters, total] = await Promise.all([
      query.take(take).skip(skip).getMany(),
      query.getCount(),
    ]);

    const totalPages = Math.ceil(total / take);

    return {
      reciters: reciters,
      total,
      totalPages,
    };
  }

  async findOne(id: number) {
    const reciter = await this.reciterRepository.findOne({
      where: { id },
      relations: ['tags'],
    });
    if (!reciter) throw new NotFoundException('Reciter not found');

    // Transform tags to string array
    return {
      ...reciter,
      tags: reciter.tags.map((tag) => ({
        name_arabic: tag.name_arabic,
        name_english: tag.name_english,
      })),
    };
  }

  async updateReciterImage(id: number, image: string) {
    const surah = await this.reciterRepository.findOneBy({ id });
    if (!surah) throw new NotFoundException('Reciter Not Found');
    surah.image = image;
    return await this.reciterRepository.save(surah);
  }

  /**
   * @deprecated
   * @returns void
   */
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

  async getRandomTilawa(reciterId?: number) {
    const tilawa = await this.tilawaRepository.find({
      where: {
        reciter_id: reciterId || In([1, 2, 3, 4, 14, 6, 13, 15, 18]),
      },
    });

    const size = 5;
    const randomTilawas = [];
    while (randomTilawas.length < Math.min(size, tilawa.length)) {
      const randomTilawa = tilawa[Math.floor(Math.random() * tilawa.length)];
      if (!randomTilawas.includes(randomTilawa)) {
        randomTilawas.push(randomTilawa);
      }
    }

    return randomTilawas;
  }

  addReciterTilawa(id: number, addTilawaDto: Omit<AddTilawaDto, 'reciter_id'>) {
    const tilawa = this.tilawaRepository.create({
      ...addTilawaDto,
      reciter_id: id,
    });
    return this.tilawaRepository.save(tilawa);
  }

  async searchReciter(name: string) {
    const reciter = await this.reciterRepository.find();

    // escape regex special characters in the search query

    const escapedName = name
      ? name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      : undefined;

    const filteredReciter = name
      ? reciter.filter(
          (reciter) =>
            reciter.name_arabic.match(new RegExp(escapedName, 'i')) ||
            reciter.name_english.match(new RegExp(escapedName, 'i')),
        )
      : reciter;

    return {
      reciters: filteredReciter,
      total: filteredReciter.length,
    };
  }
}
