import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 200 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ default: false })
  completed!: boolean;

  @Column({
    type: 'enum',
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending',
  })
  status!: 'pending' | 'in_progress' | 'completed';

  @Column({ type: 'timestamp', nullable: true })
  completedAt!: Date | null;

  @Column({ type: 'enum', enum: ['low', 'medium', 'high'], default: 'medium' })
  priority!: 'low' | 'medium' | 'high';

  @Column({ type: 'date', nullable: true })
  dueDate!: Date;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: number;

  @CreateDateColumn({ name: 'created_time' })
  createdTime!: Date;

  @UpdateDateColumn({ name: 'updated_time' })
  updatedTime!: Date;
}
