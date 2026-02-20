import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto';
import { CreateUserDto } from '../users/dto';
import { User } from '../../entities/user.entity';
import * as crypto from 'crypto';
import { USER_ROLES, UserRole } from '../../common/constants/roles.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: User; token: string }> {
    const username = registerDto.email.split('@')[0] || registerDto.email;
    const uid = await this.generateUniqueUid();
    const createUserDto: CreateUserDto = {
      username,
      uid,
      email: registerDto.email,
      password: registerDto.password,
      isActive: true,
      points: 0,
      role: USER_ROLES[registerDto.type] || UserRole.GUEST,
    };

    const user = await this.usersService.create(createUserDto);
    const token = this.generateToken(user);
    return { user, token };
  }

  async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
    // const decryptedPassword = this.decryptPassword(loginDto.password);
    const user = await this.usersService.validateUser(
      loginDto.identifier,
      loginDto.password,
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  private async generateUniqueUid(): Promise<string> {
    for (let length = 5; length <= 10; length++) {
      const maxAttempts = 100;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const uid = this.generateRandomUid(length);
        const exists = await this.usersService.findByUid(uid);
        if (!exists) {
          return uid;
        }
      }
    }
    throw new Error('Failed to generate unique uid');
  }

  private generateRandomUid(length: number): string {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    const uid = Math.floor(Math.random() * (max - min + 1)) + min;
    return uid.toString();
  }

  // 解密密码
  private decryptPassword(encryptedPassword: string): string {
    try {
      const algorithm = 'aes-256-cbc';
      const key = Buffer.from(
        process.env.ENCRYPTION_KEY || '12345678901234567890123456789012',
        'utf8',
      );
      const iv = Buffer.from(
        process.env.ENCRYPTION_IV || '1234567890123456',
        'utf8',
      );

      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      let decrypted = decipher.update(encryptedPassword, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      console.error('解密失败:', error);
      return encryptedPassword;
    }
  }

  // 密码加密
  private encryptPassword(password: string): string {
    try {
      const algorithm = 'aes-256-cbc';
      const key = Buffer.from(
        process.env.ENCRYPTION_KEY || '12345678901234567890123456789012',
        'utf8',
      );
      const iv = Buffer.from(
        process.env.ENCRYPTION_IV || '1234567890123456',
        'utf8',
      );

      const cipher = crypto.createCipheriv(algorithm, key, iv);
      let encrypted = cipher.update(password, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    } catch (error) {
      console.error('加密失败:', error);
      return password;
    }
  }

  private generateToken(user: User): string {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      uid: user.uid,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }
}
