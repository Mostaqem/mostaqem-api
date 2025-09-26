import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Reciter } from './reciter.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  name_arabic: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  name_english: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ManyToMany(() => Reciter, (reciter) => reciter.tags)
  reciters: Reciter[];
}
