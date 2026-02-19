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

  @Column({ length: 255 })
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
    default: 'user',
  })
  role!: 'admin' | 'user' | 'guest';

  @Column({ default: true })
  isActive!: boolean;

  @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
  profile?: UserProfile;

  @CreateDateColumn({ name: 'created_time' })
  createdTime!: Date;

  @UpdateDateColumn({ name: 'updated_time' })
  updatedTime!: Date;
}
