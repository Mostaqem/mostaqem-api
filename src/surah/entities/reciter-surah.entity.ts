import { Reciter } from 'src/reciter/entities/reciter.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Surah } from './surah.entity';

@Entity()
export class ReciterSurah {
  @PrimaryColumn('integer')
  reciter_id: number;

  @PrimaryColumn('integer')
  surah_id: number;

  @Column('varchar', {
    length: 255,
  })
  url: string;

  @ManyToOne(() => Reciter, (reciter) => reciter.reciterSurah)
  @JoinColumn({ name: 'reciter_id' })
  reciter: Reciter;

  @ManyToOne(() => Surah, (surah) => surah.reciterSurah)
  @JoinColumn({ name: 'surah_id' })
  surah: Surah;
}
