import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreferencesDto } from './dto/user-preferences.dto';
import { ReciterService } from 'src/reciter/reciter.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly reciterService: ReciterService,
  ) {}

  create(createUserDto: Partial<User>) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: Partial<User>) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User Not Found');
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User Not Found');
    return this.userRepository.softDelete({ id });
  }

  async getUserWithPreferences(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundException('User Not Found');
    const reciter = await this.reciterService.findOne(
      user.default_reciter_id || 1,
    );

    const recitations = await this.reciterService.getReciterTilawa(
      user.default_reciter_id,
    );

    const recitation = recitations.find((t) => t.id === user.default_tilawa_id);
    return {
      reciter,
      recitation,
    };
  }
  async updateUserPreferences(id: string, preferences: UserPreferencesDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (preferences.default_reciter_id !== undefined) {
      await this.reciterService.findOne(preferences.default_reciter_id);
      user.default_reciter_id = preferences.default_reciter_id;
    }

    if (preferences.default_tilawa !== undefined) {
      const reciterId =
        preferences.default_reciter_id ?? user.default_reciter_id;

      if (!reciterId) {
        throw new NotFoundException(
          'Cannot set tilawa without a valid reciter',
        );
      }

      const availableTilawas =
        await this.reciterService.getReciterTilawa(reciterId);

      const selectedTilawa = availableTilawas.find(
        (t) => t.id === preferences.default_tilawa,
      );

      if (!selectedTilawa) {
        throw new NotFoundException(
          `Tilawa with ID ${preferences.default_tilawa} not found for the selected reciter`,
        );
      }

      user.default_tilawa_id = selectedTilawa.id;
    }

    await this.userRepository.save(user);

    return {
      message: 'User preferences updated successfully',
    };
  }
}
