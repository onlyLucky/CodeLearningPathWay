import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Repository } from 'typeorm/repository/Repository';

import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';
import { RedisService } from '../../common/services/redis.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly redisService: RedisService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
        { uid: createUserDto.uid },
      ],
    });

    if (existingUser) {
      throw new ConflictException('Username, email or uid already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    const { password: excludedPassword, ...result } = savedUser;
    void excludedPassword;
    return result as User;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({
      select: [
        'id',
        'username',
        'email',
        'role',
        'isActive',
        'createdAt',
        'updatedAt',
      ] as any,
    });
    return users;
  }

  async findOne(id: number): Promise<User> {
    const cacheKey = this.redisService.generateUserKey(id, 'profile');
    const cachedUser = await this.redisService.get<User>(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'username',
        'email',
        'role',
        'isActive',
        'createdAt',
        'updatedAt',
      ] as any,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.redisService.set(cacheKey, user);
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  async findByUid(uid: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { uid },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Username already exists');
      }
    }

    if (updateUserDto.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already exists');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    const { password: excludedPassword, ...result } = updatedUser;
    void excludedPassword;
    return result as User;
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async validateUser(
    identifier: string,
    password: string,
  ): Promise<User | null> {
    let user: User | null = null;

    if (identifier.includes('@')) {
      user = await this.findByEmail(identifier);
    } else if (/^\d+$/.test(identifier)) {
      user = await this.findByUid(identifier);
    } else {
      user = await this.findByUsername(identifier);
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const result = { ...user };
      delete (result as any).password;
      return result as User;
    }

    return null;
  }
}
