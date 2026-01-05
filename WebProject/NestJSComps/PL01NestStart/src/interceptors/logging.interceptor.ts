import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * LoggingInterceptor - 日志拦截器
 *
 * 拦截器（Interceptor）是 NestJS 中用于实现面向切面编程（AOP）的强大工具
 * 它可以在请求处理的不同阶段添加额外的逻辑，例如：
 * - 记录请求和响应的日志
 * - 修改请求或响应数据
 * - 缓存响应
 * - 处理异常
 * - 测量执行时间
 *
 * NestInterceptor 接口要求实现 intercept() 方法
 * 该方法接收两个参数：
 * 1. ExecutionContext: 执行上下文，提供对请求/响应对象的访问
 * 2. CallHandler: 调用处理器，用于调用路由处理程序并返回响应流
 *
 * 拦截器的工作原理：
 * 1. 在路由处理程序执行前执行逻辑
 * 2. 调用 next.handle() 执行路由处理程序
 * 3. 在响应返回后执行逻辑
 * 4. 可以使用 RxJS 操作符修改响应流
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  /**
   * 拦截方法
   *
   * @param context - 执行上下文，包含请求和响应信息
   * @param next - 调用处理器，用于调用路由处理程序
   * @returns Observable<unknown> - 返回响应的可观察对象
   *
   * 执行流程：
   * 1. 在路由处理程序执行前打印 "Before..." 日志
   * 2. 记录当前时间戳，用于计算请求处理时间
   * 3. 调用 next.handle() 执行路由处理程序
   * 4. 使用 tap 操作符在响应返回后打印日志和执行时间
   *
   * tap 操作符的作用：
   * - 不会修改响应数据
   * - 只是在响应流中执行副作用（如打印日志）
   * - 适合用于日志记录、性能监控等场景
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    console.log('Before...');

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
