import { BaseSeed } from './base.seed';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';

export class UserSeed extends BaseSeed {
  async run(): Promise<void> {
    const userRepository = this.dataSource.getRepository(User);

    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        isActive: true,
      },
      {
        username: 'user1',
        email: 'user1@example.com',
        password: hashedPassword,
        isActive: true,
      },
      {
        username: 'user2',
        email: 'user2@example.com',
        password: hashedPassword,
        isActive: true,
      },
    ];

    await this.truncate(['user']);
    await userRepository.save(users);
  }
}
