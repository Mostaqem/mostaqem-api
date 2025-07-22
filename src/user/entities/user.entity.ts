import { Exclude } from 'class-transformer';
import { Favorite } from 'src/favorites/entities/favorite.entity';
import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { ulid } from 'ulid';

@Entity()
export class User {
  @PrimaryColumn('char', {
    length: 26,
  })
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = ulid();
  }

  @Column('varchar', { length: 50 })
  name: string;

  @Column('varchar', { length: 100, unique: true })
  email: string;

  @Column({ default: 1 })
  default_reciter_id: number;

  @Column({ default: 178 })
  default_tilawa_id: number;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date | null = null;

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];
}
