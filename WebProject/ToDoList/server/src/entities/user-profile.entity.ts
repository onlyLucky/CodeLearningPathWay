import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', unique: true })
  userId!: number;

  @Column({ length: 50 })
  userName!: string;

  @Column({ type: 'date', nullable: true })
  birthDate?: Date;

  @Column({ type: 'int', nullable: true })
  age?: number;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @CreateDateColumn({ name: 'created_time' })
  createdTime!: Date;

  @UpdateDateColumn({ name: 'updated_time' })
  updatedTime!: Date;
}
