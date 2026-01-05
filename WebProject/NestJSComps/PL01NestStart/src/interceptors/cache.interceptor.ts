import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * CacheInterceptor - 缓存拦截器
 *
 * 该拦截器演示了如何实现响应缓存功能
 * 使用内存缓存（Map）来存储响应数据，提高性能
 *
 * 使用场景：
 * - 缓存不经常变化的数据
 * - 减少数据库查询
 * - 提高响应速度
 * - 降低服务器负载
 *
 * 工作原理：
 * 1. 根据请求的 HTTP 方法和 URL 生成缓存键
 * 2. 检查缓存中是否存在该键的响应
 * 3. 如果缓存命中，直接返回缓存的数据
 * 4. 如果缓存未命中，执行路由处理程序
 * 5. 将响应数据存入缓存
 *
 * 注意事项：
 * - 这是内存缓存，服务器重启后缓存会丢失
 * - 生产环境应考虑使用 Redis 等分布式缓存
 * - 需要实现缓存失效策略（如 TTL、手动清除等）
 * - 适用于 GET 请求，不适用于 POST/PUT/DELETE 等修改操作
 */
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInterceptor.name);
  private readonly cache = new Map<string, unknown>();

  /**
   * 拦截方法
   *
   * @param context - 执行上下文，包含请求和响应信息
   * @param next - 调用处理器，用于调用路由处理程序
   * @returns Observable<unknown> - 返回响应（可能来自缓存）
   *
   * 执行流程：
   * 1. 从执行上下文中获取 HTTP 请求对象
   * 2. 根据请求方法和 URL 生成缓存键
   * 3. 检查缓存中是否存在该键的响应
   * 4. 如果缓存命中，使用 of() 返回缓存数据的 Observable
   * 5. 如果缓存未命中，调用 next.handle() 执行路由处理程序
   * 6. 使用 tap 操作符将响应数据存入缓存
   *
   * of() 操作符的作用：
   * - 将普通值转换为 Observable
   * - 用于同步返回缓存数据
   *
   * tap 操作符的作用：
   * - 在响应返回后执行副作用
   * - 这里用于将响应数据存入缓存
   *
   * 示例：
   * - 第一次请求 GET /cats：缓存未命中，执行查询，存入缓存
   * - 第二次请求 GET /cats：缓存命中，直接返回缓存数据
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const cacheKey = this.generateCacheKey(request);

    const cachedResponse = this.cache.get(cacheKey);
    if (cachedResponse) {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
      return of(cachedResponse);
    }

    this.logger.log(`Cache miss for key: ${cacheKey}`);
    return next.handle().pipe(
      tap((response) => {
        this.cache.set(cacheKey, response);
      }),
    );
  }

  /**
   * 生成缓存键
   *
   * @param request - HTTP 请求对象
   * @returns string - 缓存键
   *
   * 缓存键的生成规则：
   * - 使用 HTTP 方法和 URL 的组合
   * - 例如：GET-/cats, POST-/cats
   * - 这样可以区分不同方法和路径的请求
   *
   * 扩展建议：
   * - 可以考虑加入查询参数
   * - 可以考虑加入请求头（如 Authorization）
   * - 可以使用更复杂的哈希算法
   */
  private generateCacheKey(request: Record<string, unknown>): string {
    return `${String(request.method)}-${String(request.url)}`;
  }
}
