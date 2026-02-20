import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Repository } from 'typeorm/repository/Repository';

import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { UserProfile } from '../../entities/user-profile.entity';
import { CreateUserDto, UpdateUserDto } from './dto';
import { RedisService } from '../../common/services/redis.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
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

    // 对密码进行哈希处理
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    const userProfile = this.userProfileRepository.create({
      userId: savedUser.id,
      userName: savedUser.username,
    });

    await this.userProfileRepository.save(userProfile);

    const userWithProfile = await this.userRepository.findOne({
      where: { id: savedUser.id },
      relations: ['profile'],
    });

    const {
      createdTime: excludedCreatedTime,
      updatedTime: excludedUpdatedTime,
      profile,
      ...result
    } = userWithProfile || savedUser;
    void excludedCreatedTime;
    void excludedUpdatedTime;

    const {
      createdTime: profileCreatedTime,
      updatedTime: profileUpdatedTime,
      ...profileResult
    } = profile || {};
    void profileCreatedTime;
    void profileUpdatedTime;

    return { ...result, profile: profileResult } as User;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({
      select: [
        'id',
        'username',
        'email',
        'role',
        'isActive',
        'createdTime',
        'updatedTime',
      ] as any,
      relations: ['profile'],
    });

    return users || [];
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
        'createdTime',
        'updatedTime',
        'points',
        'signature',
        'avatar',
      ] as any,
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.redisService.set(cacheKey, user);
    return user;
  }

  async findByUsername(userName: string): Promise<User | null> {
    const user = await this.userRepository.createQueryBuilder('user')
      .leftJoin('user.profile', 'profile')
      .select([
        'user.id as userId',
        'user.username as userName',
        'user.email as email',
        'user.password as password',
        'user.role as role',
        'user.isActive as isActive',
        'user.createdTime as createdTime',
        'user.updatedTime as updatedTime',
        'user.points as points',
        'user.signature as signature',
        'user.avatar as avatar',
        'profile.birthDate as birthDate',
        'profile.age as age',
        'profile.address as address',
      ] as any)
      .where('user.userName = :userName', { userName })
      .getRawOne();  // 关键：使用 getRawOne 获取原始对象 getRawMany 会返回多个对象
    return user || null;
  }

  async findByUid(uid: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { uid },
      relations: ['profile'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['profile'],
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

  async remove(id: number): Promise<null> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return null;
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

    const compareResult = await bcrypt.compare(password, user?.password || '');
    if (user && compareResult) {
      const userWithProfile = await this.userRepository.findOne({
        where: { id: user.id },
        relations: ['profile'],
      });

      const {
        password: excludedPassword,
        createdTime: excludedCreatedTime,
        updatedTime: excludedUpdatedTime,
        profile,
        ...result
      } = userWithProfile || user;
      void excludedPassword;
      void excludedCreatedTime;
      void excludedUpdatedTime;

      const {
        createdTime: profileCreatedTime,
        updatedTime: profileUpdatedTime,
        ...profileResult
      } = profile || {};
      void profileCreatedTime;
      void profileUpdatedTime;

      return { ...result, profile: profileResult } as User;
    }

    return null;
  }
}
