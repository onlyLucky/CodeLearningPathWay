import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * 基于 IP 的简易限流守卫
 * 通过 @SetMetadata('throttle:limit', number) 与 @SetMetadata('throttle:ttl', number) 可分别设置
 * 单个处理器或整个控制器的请求上限（limit）与时间窗口（ttl，单位毫秒）
 */
@Injectable()
export class ThrottlerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * 每次请求进入时触发
   * 1. 读取限流配置（先方法级，后类级，最后使用默认值）
   * 2. 根据 method + url + ip 生成唯一 key
   * 3. 查询当前已访问次数，若超限则抛出 429
   * 4. 设置响应头 X-RateLimit-* 并递增访问次数
   */
  canActivate(context: ExecutionContext): boolean {
    // 获取当前处理器函数与所在类
    const handler = context.getHandler();
    const classRef = context.getClass();

    // 读取限流上限（默认 10 次）
    const limit =
      this.reflector.get<number>('throttle:limit', handler) ||
      this.reflector.get<number>('throttle:limit', classRef) ||
      10;

    // 读取时间窗口（默认 60 秒）
    const ttl =
      this.reflector.get<number>('throttle:ttl', handler) ||
      this.reflector.get<number>('throttle:ttl', classRef) ||
      60000;

    // 获取请求与响应对象
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // 获取客户端真实 IP
    const ip = request.ip || request.connection.remoteAddress;
    // 生成唯一限流 key
    const key = `${request.method}-${request.url}-${ip}`;

    // 查询当前访问记录
    const record = this.getRecord(key);

    // 若已超限，直接抛出 429
    if (record && record.totalHits >= limit) {
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // 计算当前时间窗口剩余秒数
    const ttlRemaining = Math.ceil(
      (record?.expiresAt || Date.now() + ttl) - Date.now(),
    );

    // 设置标准 RateLimit 响应头
    response.header('X-RateLimit-Limit', limit.toString());
    response.header(
      'X-RateLimit-Remaining',
      (limit - (record?.totalHits || 0)).toString(),
    );
    response.header('X-RateLimit-Reset', ttlRemaining.toString());

    // 递增访问次数
    this.incrementRecord(key, ttl);

    // 放行请求
    return true;
  }

  /**
   * 根据 key 查询访问记录
   * @param _key 限流 key
   * @returns 若存在返回 { totalHits, expiresAt }，否则 undefined
   * 注：此处为示例实现，实际应接入 Redis 等持久化存储
   */
  private getRecord(
    _key: string,
  ): { totalHits: number; expiresAt: number } | undefined {
    void _key;
    return undefined;
  }

  /**
   * 递增对应 key 的访问次数
   * @param _key 限流 key
   * @param _ttl 时间窗口（毫秒）
   * 注：此处为示例实现，实际应接入 Redis 等持久化存储
   */
  private incrementRecord(_key: string, _ttl: number): void {
    void _key;
    void _ttl;
  }
}
