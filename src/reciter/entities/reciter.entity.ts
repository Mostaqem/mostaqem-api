import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tilawa } from './tilawa.entity';

@Entity()
export class Reciter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  @Index('IDX_NAME_ENGLISH', { fulltext: true })
  name_english: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  @Index('IDX_NAME_ARABIC', { fulltext: true })
  name_arabic: string;

  @Column('varchar', {
    length: 250,
    nullable: true,
  })
  image: string;

  @OneToMany(() => Tilawa, (telawaa) => telawaa.reciter, {
    onDelete: 'CASCADE',
  })
  tilawa: Tilawa[];
}
