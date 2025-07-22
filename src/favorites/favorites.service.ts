import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { Repository } from 'typeorm';
import { TilawaSurah } from 'src/surah/entities/tilawa-surah.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    @InjectRepository(TilawaSurah)
    private tilawaSurahRepository: Repository<TilawaSurah>,
  ) {}

  async create(createFavoriteDto: CreateFavoriteDto): Promise<Favorite> {
    // Check if tilawaSurah exists
    const tilawaSurah = await this.tilawaSurahRepository.findOne({
      where: {
        tilawa_id: createFavoriteDto.tilawa_id,
        surah_id: createFavoriteDto.surah_id,
      },
    });

    if (!tilawaSurah) {
      throw new NotFoundException(
        `TilawaSurah with tilawa_id ${createFavoriteDto.tilawa_id} and surah_id ${createFavoriteDto.surah_id} not found`,
      );
    }

    // Create and save the favorite
    const favorite = this.favoriteRepository.create(createFavoriteDto);
    return this.favoriteRepository.save(favorite).catch((error) => {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException(
          `Favorite with tilawa_id ${createFavoriteDto.tilawa_id} and surah_id ${createFavoriteDto.surah_id} already exists`,
        );
      } else {
        throw error;
      }
    });
  }

  async findAll(userId: string): Promise<Favorite[]> {
    return this.favoriteRepository
      .createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.tilawaSurah', 'tilawaSurah')
      .leftJoinAndSelect('tilawaSurah.surah', 'surah')
      .leftJoinAndSelect('tilawaSurah.tilawa', 'tilawa')
      .leftJoinAndSelect('tilawa.reciter', 'reciter')
      .where('favorite.user_id = :userId', { userId })
      .select([
        'favorite',
        'tilawaSurah.tilawa_id',
        'tilawaSurah.surah_id',
        'tilawaSurah.url',
        'surah',
        'tilawa',
        'reciter',
      ])
      .getMany();
  }

  async findOne(id: string): Promise<Favorite> {
    const favorite = await this.favoriteRepository.findOne({
      where: { id },
      relations: ['tilawaSurah'],
    });

    if (!favorite) {
      throw new NotFoundException(`Favorite with ID ${id} not found`);
    }

    return favorite;
  }

  async remove(id: string): Promise<void> {
    const favorite = await this.findOne(id);
    await this.favoriteRepository.remove(favorite);
  }
}
