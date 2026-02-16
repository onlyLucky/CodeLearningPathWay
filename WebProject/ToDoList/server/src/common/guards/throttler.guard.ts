import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisService } from '../services/redis.service';

/**
 * 限速记录数据结构
 */
interface RateLimitRecord {
  /** 当前周期内已接收到的请求次数 */
  totalHits: number;
  /** 当前限速周期的过期时间戳（毫秒） */
  expiresAt: number;
}

/**
 * 基于 Redis 的通用请求限速守卫
 * 通过装饰器 @Throttle(limit, ttl) 可自定义单一路由或控制器的限速策略
 *
 *
 */
@Injectable()
export class ThrottlerGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private redisService: RedisService,
  ) {}

  /**
   * 每次请求进入时触发
   * @param context 执行上下文，可获取请求、响应及处理器元数据
   * @returns true 表示允许通过；抛出异常则拒绝访问
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();
    const classRef = context.getClass();

    // 优先级：方法级装饰器 > 控制器级装饰器 > 默认值 10 次
    const limit =
      this.reflector.get<number>('throttle:limit', handler) ||
      this.reflector.get<number>('throttle:limit', classRef) ||
      10;

    // 优先级：方法级装饰器 > 控制器级装饰器 > 默认值 60 秒（60000 ms）
    const ttl =
      this.reflector.get<number>('throttle:ttl', handler) ||
      this.reflector.get<number>('throttle:ttl', classRef) ||
      60000;

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    // 获取客户端 IP，兼容不同代理模式
    const ip = request.ip || request.connection.remoteAddress;
    // 生成唯一限速键：方法 + 路由 + IP
    const key = `${request.method}-${request.url}-${ip}`;

    // 从 Redis 读取当前周期已访问次数
    const record = await this.getRecord(key);

    // 若已达上限，直接抛出 429 异常
    if (record && record.totalHits >= limit) {
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // 计算当前限速周期剩余时间（秒）
    const ttlRemaining = Math.ceil(
      (record?.expiresAt || Date.now() + ttl) - Date.now(),
    );

    // 在响应头中返回限速信息，方便客户端控制频率
    response.header('X-RateLimit-Limit', limit.toString());
    response.header(
      'X-RateLimit-Remaining',
      (limit - (record?.totalHits || 0)).toString(),
    );
    response.header('X-RateLimit-Reset', ttlRemaining.toString());

    // 累加访问次数并回写 Redis
    await this.incrementRecord(key, ttl);

    // 放行请求
    return true;
  }

  /**
   * 从 Redis 获取指定 key 的限速记录
   * @param key 限速键
   * @returns 限速记录或 undefined（无记录）
   */
  private async getRecord(key: string): Promise<RateLimitRecord | undefined> {
    return await this.redisService.get<RateLimitRecord>(key);
  }

  /**
   * 将请求次数 +1 并写回 Redis，同时重置过期时间
   * @param key 限速键
   * @param ttl 生命周期（毫秒），会转换成秒传给 Redis
   */
  private async incrementRecord(key: string, ttl: number): Promise<void> {
    const record = await this.getRecord(key);
    const newRecord: RateLimitRecord = {
      totalHits: (record?.totalHits || 0) + 1,
      expiresAt: Date.now() + ttl,
    };
    // Redis 的 set 需要秒单位，故除以 1000
    await this.redisService.set(key, newRecord, ttl / 1000);
  }
}
