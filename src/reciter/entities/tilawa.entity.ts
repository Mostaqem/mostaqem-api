import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Reciter } from './reciter.entity';
import { TilawaSurah } from 'src/surah/entities/tilawa-surah.entity';

@Entity()
export class Tilawa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 150,
    nullable: false,
  })
  name: string;

  @Column('varchar', {
    length: 250,
    nullable: true,
  })
  name_english: string;

  @Column()
  reciter_id: number;

  @ManyToOne(() => Reciter, (reciter) => reciter.tilawa)
  @JoinColumn({ name: 'reciter_id' })
  reciter: Reciter;

  @OneToMany(() => TilawaSurah, (tilawaSurah) => tilawaSurah.tilawa)
  tilawaSurah: TilawaSurah[];
}
