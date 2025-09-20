import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tilawa } from './tilawa.entity';
import { Tag } from './tag.entity';

export enum ReciterCategory {
  MODERN = 'modern',
  CLASSIC = 'classic',
}

export enum ReciterRegion {
  EGYPT = 'egypt',
  SAUDI = 'saudi',
  GULF = 'gulf',
  MAGHREB = 'maghreb',
  LEVANT = 'levant',
  OTHER = 'other',
}

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

  @Column({
    type: 'enum',
    enum: ReciterCategory,
    nullable: true,
  })
  category: ReciterCategory;

  @Column({
    type: 'enum',
    enum: ReciterRegion,
    nullable: true,
  })
  region: ReciterRegion;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_featured: boolean;

  @OneToMany(() => Tilawa, (telawaa) => telawaa.reciter, {
    onDelete: 'CASCADE',
  })
  tilawa: Tilawa[];

  @ManyToMany(() => Tag, (tag) => tag.reciters)
  @JoinTable({
    name: 'reciter_tags',
    joinColumn: {
      name: 'reciter_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: Tag[];
}
