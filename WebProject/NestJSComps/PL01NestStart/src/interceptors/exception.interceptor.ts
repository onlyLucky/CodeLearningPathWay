import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * ExceptionInterceptor - 异常拦截器
 *
 * 该拦截器演示了如何捕获和标准化异常响应格式
 * 它将所有异常转换为统一的错误响应格式
 *
 * 使用场景：
 * - 统一错误响应格式
 * - 添加额外的错误信息（如时间戳、路径等）
 * - 隐藏敏感的错误详情
 * - 记录错误日志
 *
 * 工作原理：
 * 1. 使用 catchError 操作符捕获路由处理程序抛出的异常
 * 2. 检查异常是否为 HttpException 类型
 * 3. 如果是 HttpException，提取状态码和响应信息
 * 4. 如果不是 HttpException，使用 500 内部服务器错误
 * 5. 构造统一的错误响应格式
 *
 * 统一的错误响应格式：
 * {
 *   statusCode: number,    // HTTP 状态码
 *   message: any,          // 错误消息
 *   timestamp: string,     // 时间戳
 *   path: string           // 请求路径
 * }
 *
 * 注意事项：
 * - 该拦截器与 HttpExceptionFilter 功能类似
 * - 拦截器更适合处理响应流的转换
 * - 过滤器更适合处理异常的捕获和响应
 * - 可以根据需要选择使用拦截器或过滤器
 */
@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  /**
   * 拦截方法
   *
   * @param context - 执行上下文，包含请求和响应信息
   * @param next - 调用处理器，用于调用路由处理程序
   * @returns Observable<unknown> - 返回响应或标准化的错误
   *
   * 执行流程：
   * 1. 调用 next.handle() 执行路由处理程序
   * 2. 使用 catchError 捕获可能抛出的异常
   * 3. 检查异常类型，构造相应的错误响应
   * 4. 返回标准化的错误响应
   *
   * catchError 操作符的作用：
   * - 捕获上游 Observable 抛出的错误
   * - 可以选择处理错误或重新抛出
   * - 返回一个新的 Observable 来替换错误的 Observable
   *
   * 错误处理逻辑：
   * - HttpException: 提取状态码和响应信息，构造标准化错误
   * - 其他错误: 使用 500 状态码和通用错误消息
   *
   * 示例：
   * - 抛出 new NotFoundException('Cat not found')
   *   转换为: { statusCode: 404, message: 'Cat not found', timestamp: '...', path: '/cats/1' }
   * - 抛出 new Error('Database error')
   *   转换为: { statusCode: 500, message: 'Internal server error', timestamp: '...', path: '/cats/1' }
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          return throwError(() => {
            const status = error.getStatus();
            const response = error.getResponse();

            return {
              statusCode: status,
              message: response,
              timestamp: new Date().toISOString(),
              path: context.switchToHttp().getRequest().url,
            };
          });
        }

        return throwError(() => ({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
          timestamp: new Date().toISOString(),
          path: context.switchToHttp().getRequest().url,
        }));
      }),
    );
  }
}
