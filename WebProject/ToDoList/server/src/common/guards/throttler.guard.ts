import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisService } from '../services/redis.service';

interface RateLimitRecord {
  totalHits: number;
  expiresAt: number;
}

@Injectable()
export class ThrottlerGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();
    const classRef = context.getClass();

    const limit =
      this.reflector.get<number>('throttle:limit', handler) ||
      this.reflector.get<number>('throttle:limit', classRef) ||
      10;

    const ttl =
      this.reflector.get<number>('throttle:ttl', handler) ||
      this.reflector.get<number>('throttle:ttl', classRef) ||
      60000;

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const ip = request.ip || request.connection.remoteAddress;
    const key = `${request.method}-${request.url}-${ip}`;

    const record = await this.getRecord(key);

    if (record && record.totalHits >= limit) {
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const ttlRemaining = Math.ceil(
      (record?.expiresAt || Date.now() + ttl) - Date.now(),
    );

    response.header('X-RateLimit-Limit', limit.toString());
    response.header(
      'X-RateLimit-Remaining',
      (limit - (record?.totalHits || 0)).toString(),
    );
    response.header('X-RateLimit-Reset', ttlRemaining.toString());

    await this.incrementRecord(key, ttl);

    return true;
  }

  private async getRecord(key: string): Promise<RateLimitRecord | undefined> {
    return await this.redisService.get<RateLimitRecord>(key);
  }

  private async incrementRecord(key: string, ttl: number): Promise<void> {
    const record = await this.getRecord(key);
    const newRecord: RateLimitRecord = {
      totalHits: (record?.totalHits || 0) + 1,
      expiresAt: Date.now() + ttl,
    };
    await this.redisService.set(key, newRecord, ttl / 1000);
  }
}
