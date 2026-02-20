import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserProfile } from './user-profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 50 })
  username!: string;

  @Column({ unique: true, length: 20 })
  uid!: string;

  @Column({ unique: true, length: 100 })
  email!: string;

  @Column({ length: 255, select: false })
  password!: string;

  @Column({ type: 'text', nullable: true })
  signature?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar?: string;

  @Column({ type: 'int', default: 0 })
  points!: number;

  @Column({
    type: 'enum',
    enum: ['admin', 'user', 'guest'],
    default: 'guest',
  })
  role!: 'admin' | 'user' | 'guest';

  @Column({ default: true })
  isActive!: boolean;

  // 关联用户个人信息 cascade: true 级联操作，当用户被删除时，关联的个人信息也会被删除
  @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
  profile?: UserProfile;

  @CreateDateColumn({ name: 'created_time' })
  createdTime!: Date;

  @UpdateDateColumn({ name: 'updated_time' })
  updatedTime!: Date;
}
