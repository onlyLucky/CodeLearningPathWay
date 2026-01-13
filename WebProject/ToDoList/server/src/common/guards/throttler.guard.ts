import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ThrottlerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
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

    const record = this.getRecord(key);

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

    this.incrementRecord(key, ttl);

    return true;
  }

  private getRecord(
    _key: string,
  ): { totalHits: number; expiresAt: number } | undefined {
    void _key;
    return undefined;
  }

  private incrementRecord(_key: string, _ttl: number): void {
    void _key;
    void _ttl;
  }
}
