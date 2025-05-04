import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
}
