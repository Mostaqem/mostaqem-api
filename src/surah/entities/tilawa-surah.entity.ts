import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Surah } from './surah.entity';
import { Tilawa } from 'src/reciter/entities/tilawa.entity';

@Entity()
export class TilawaSurah {
  @PrimaryColumn('integer')
  tilawa_id: number;

  @PrimaryColumn('integer')
  surah_id: number;

  @Column('varchar', {
    length: 255,
  })
  url: string;

  @ManyToOne(() => Tilawa, (tilawa) => tilawa.tilawaSurah)
  @JoinColumn({ name: 'tilawa_id' })
  tilawa: Tilawa;

  @ManyToOne(() => Surah, (surah) => surah.reciterSurah)
  @JoinColumn({ name: 'surah_id' })
  surah: Surah;
}
