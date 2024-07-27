import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tilawa } from './tilawa.entity';

@Entity()
export class Reciter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 100,
    nullable: false,
  })
  name_english: string;

  @Column('varchar', {
    length: 100,
    nullable: false,
  })
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
