import {
  Injectable, // 可注入的服务，用于依赖注入
  NestInterceptor, // 拦截器基类，用于实现自定义拦截逻辑
  ExecutionContext, // 执行上下文，包含请求与响应对象
  CallHandler, // 调用处理器，用于继续执行后续逻辑
  Logger, // 日志服务，用于记录日志
} from '@nestjs/common';
// 引入 Observable 类型，用于表示异步操作的序列
import { Observable } from 'rxjs';
// 引入 tap 操作符，用于在 Observable 流中执行副作用操作
import { tap } from 'rxjs/operators';

/**
 * 日志拦截器
 * 用于记录每个 HTTP 请求的进入、成功完成以及失败时的详细信息
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  /**
   * 拦截 HTTP 请求并记录日志
   * @param context 执行上下文，包含请求与响应对象
   * @param next 调用处理器，用于继续执行后续逻辑
   * @returns Observable，在请求完成或失败时记录日志
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    // 记录请求进入日志
    this.logger.log(`Incoming Request: ${method} ${url}`);

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const delay = Date.now() - now;
          // 记录请求成功完成日志，包含状态码与耗时
          this.logger.log(
            `Request completed: ${method} ${url} - Status: ${response.statusCode} - ${delay}ms`,
          );
        },
        error: (error) => {
          const delay = Date.now() - now;
          // 记录请求失败日志，包含错误信息与耗时
          this.logger.error(
            `Request failed: ${method} ${url} - Error: ${error.message} - ${delay}ms`,
          );
        },
      }),
    );
  }
}
