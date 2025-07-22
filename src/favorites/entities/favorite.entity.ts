import { Exclude } from 'class-transformer';
import { TilawaSurah } from 'src/surah/entities/tilawa-surah.entity';
import { User } from 'src/user/entities/user.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { ulid } from 'ulid';

@Entity('favorites')
@Unique(['tilawa_id', 'surah_id', 'user_id'])
export class Favorite {
  @PrimaryColumn('varchar', {
    length: 26,
  })
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = ulid();
  }

  @Exclude()
  @Column('integer')
  tilawa_id: number;

  @Exclude()
  @Column('integer')
  surah_id: number;

  @Column('varchar', { length: 26 })
  user_id: string;

  // relationships

  @ManyToOne(() => User, (user) => user.favorites, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => TilawaSurah, (tilawaSurah) => tilawaSurah.tilawa, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    { name: 'tilawa_id', referencedColumnName: 'tilawa_id' },
    { name: 'surah_id', referencedColumnName: 'surah_id' },
  ])
  tilawaSurah: TilawaSurah;
}
