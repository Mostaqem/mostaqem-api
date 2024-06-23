import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
