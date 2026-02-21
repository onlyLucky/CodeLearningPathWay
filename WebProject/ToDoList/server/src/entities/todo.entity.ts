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
  description?: string;

  @Column({ default: false })
  completed!: boolean;

  @Column({
    type: 'enum',
    enum: ['0', '1', '2'], //0: pending, 1: in_progress, 2: completed
    default: '0',
  })
  status!: '0' | '1' | '2';

  @Column({ type: 'timestamp', nullable: true, name: 'completed_time' })
  completedTime?: Date | null;

  @Column({
    type: 'enum',
    enum: ['0', '1', '2', '3', '4'], //0: 不提示, 1: 每天, 2: 每周, 3: 每月, 4: 每年
    default: '0',
    name: 'reminder_type',
  })
  reminderType?: '0' | '1' | '2' | '3' | '4';

  // 优先级 0: low, 1: medium, 2: high
  @Column({ type: 'enum', enum: ['0', '1', '2'], default: '1' })
  priority?: '0' | '1' | '2';

  // 提醒时间
  @Column({ type: 'timestamp', nullable: true, name: 'reminder_time' })
  reminderTime?: Date | null;

  // 截止时间 默认每天最后时间
  @Column({ type: 'date', nullable: true, name: 'deadline_time' })
  deadlineTime?: Date | null;

  // 评分
  @Column({ type: 'float', name: 'score', default: 0.0 })
  score?: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: number;

  @CreateDateColumn({ name: 'created_time', select: false })
  createdTime!: Date;

  @UpdateDateColumn({ name: 'updated_time', select: false })
  updatedTime!: Date;
}
