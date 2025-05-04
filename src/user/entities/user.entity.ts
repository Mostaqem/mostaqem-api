import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';
import { ulid } from 'ulid';

@Entity()
export class User {
  @PrimaryColumn('char', {
    length: 26,
  })
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = ulid();
  }

  @Column('varchar', { length: 50 })
  name: string;

  @Column('varchar', { length: 100, unique: true })
  email: string;

  @DeleteDateColumn({ select: false })
  deleatedAt: Date | null = null;
}
