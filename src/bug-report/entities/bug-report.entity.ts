import { User } from 'src/user/entities/user.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { ulid } from 'ulid';

@Entity('bug_reports')
export class BugReport {
  @PrimaryColumn('char', { length: 26 })
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = ulid();
  }

  @Column('char', { length: 26 })
  user_id: string;

  @Column('int')
  android_version: number;

  @Column('varchar', { length: 100 })
  brand: string;

  @Column('text')
  body: string;

  @Column('varchar', { length: 255, nullable: true })
  image_url: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
