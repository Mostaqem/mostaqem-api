import { Verse } from 'src/verse/entities/verse.entity';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';

@Entity()
export class Surah {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 100,
  })
  name_arabic: string;

  @Column('varchar', {
    length: 100,
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
}
