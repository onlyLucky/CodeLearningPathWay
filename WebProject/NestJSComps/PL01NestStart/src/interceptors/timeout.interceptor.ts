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
 * TimeoutInterceptor - 超时拦截器
 *
 * 该拦截器演示了如何使用 RxJS 的 timeout 和 catchError 操作符
 * 来处理请求超时的情况
 *
 * 使用场景：
 * - 防止长时间运行的请求占用资源
 * - 提高系统的响应性和可靠性
 * - 避免客户端长时间等待
 *
 * 工作原理：
 * 1. 使用 timeout 操作符设置请求的最大执行时间
 * 2. 如果请求在指定时间内完成，正常返回响应
 * 3. 如果请求超时，抛出 TimeoutError
 * 4. 使用 catchError 操作符捕获超时错误
 * 5. 将 TimeoutError 转换为 NestJS 的 RequestTimeoutException
 *
 * 注意事项：
 * - 超时时间应根据实际业务需求设置
 * - 对于需要长时间处理的操作，应考虑使用异步任务队列
 * - 超时后，原始请求会被取消，不会继续执行
 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  /**
   * 拦截方法
   *
   * @param context - 执行上下文，包含请求和响应信息
   * @param next - 调用处理器，用于调用路由处理程序
   * @returns Observable<unknown> - 返回响应或超时错误
   *
   * 执行流程：
   * 1. 调用 next.handle() 执行路由处理程序
   * 2. 使用 timeout(5000) 设置 5 秒超时
   * 3. 使用 catchError 捕获可能的错误
   * 4. 如果是 TimeoutError，转换为 RequestTimeoutException
   * 5. 如果是其他错误，重新抛出
   *
   * timeout 操作符的作用：
   * - 设置 Observable 的最大执行时间
   * - 如果在指定时间内没有完成，抛出 TimeoutError
   * - 单位是毫秒
   *
   * catchError 操作符的作用：
   * - 捕获上游 Observable 抛出的错误
   * - 可以选择处理错误或重新抛出
   * - 返回一个新的 Observable 来替换错误的 Observable
   *
   * 示例：
   * - 正常情况：请求在 3 秒内完成，正常返回响应
   * - 超时情况：请求超过 5 秒未完成，返回 408 Request Timeout
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      timeout(5000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err as Error);
      }),
    );
  }
}
