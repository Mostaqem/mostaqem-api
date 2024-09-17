import { Surah } from 'src/surah/entities/surah.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Index('SURAH_VERSE_UNIQUE', ['surah_id', 'verse_number'])
export class Verse {
  @PrimaryGeneratedColumn()
  id: number;

  //for full text search
  @Column({ type: 'text', charset: 'utf8mb4' })
  @Index('IDX_VERS', { fulltext: true })
  vers: string;

  @Column('int')
  verse_number: number;

  @Column('varchar', {
    length: 3,
  })
  vers_lang: string;

  @Column()
  @Index('idx_surah_id')
  surah_id: number;

  /** Relations */
  @ManyToOne(() => Surah, (surah) => surah.verses)
  @JoinColumn([{ name: 'surah_id', referencedColumnName: 'id' }])
  surah: Surah;
}
