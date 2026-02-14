import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

/**
 * 全局请求超时拦截器
 * 用于限制请求处理的最长时间，超时后自动返回 408 状态码
 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  /**
   * 拦截器核心方法
   * @param _context 执行上下文（可获取请求、响应等对象）
   * @param next 调用链的下一环，通过调用 next.handle() 继续执行后续逻辑
   * @returns Observable 流，可对响应数据进行额外处理
   */
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      // 设置 5 秒超时限制；若下游 Observable 在此时间内未发出值，则抛出 TimeoutError
      timeout(5000),
      // 捕获超时或其他错误，统一包装后抛出
      catchError((err) => {
        if (err instanceof TimeoutError) {
          // 超时错误转换为 NestJS 的 RequestTimeoutException，前端将收到 408 状态码
          return throwError(
            () => new RequestTimeoutException('Request timeout'),
          );
        }
        // 非超时错误原样抛出，由全局异常过滤器继续处理
        return throwError(() => err);
      }),
    );
  }
}
