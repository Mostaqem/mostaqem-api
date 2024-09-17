import { Verse } from 'src/verse/entities/verse.entity';
import { Entity, Index, OneToMany } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { TilawaSurah } from './tilawa-surah.entity';

@Entity()
@Index('IDX_SURAH', [
  'id',
  'name_arabic',
  'name_complex',
  'verses_count',
  'revelation_place',
  'image',
])
export class Surah {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 100,
  })
  @Index('IDX_SURAH_NAME_ARABIC', {
    unique: true,
  })
  name_arabic: string;

  @Column('varchar', {
    length: 100,
  })
  @Index('IDX_SURAH_NAME_COMPLEX', {
    unique: true,
  })
  name_complex: string;

  @Column('integer')
  verses_count: number;

  @Column('varchar', {
    length: 30,
  })
  revelation_place: string;

  @Column('varchar', {
    length: 250,
    nullable: true,
  })
  image?: string;

  @OneToMany(() => Verse, (verse) => verse.surah)
  verses: Verse[];

  @OneToMany(() => TilawaSurah, (reciterSurah) => reciterSurah.surah, {
    onDelete: 'CASCADE',
  })
  reciterSurah: TilawaSurah[];
}
