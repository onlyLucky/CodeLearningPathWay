import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * 统一响应格式接口
 * @template T 响应数据的类型
 */
export interface Response<T> {
  /** 请求是否成功 */
  success: boolean;
  /** HTTP 状态码 */
  statusCode: number;
  /** 响应消息 */
  message: string;
  /** 响应数据 */
  data: T;
  /** 响应时间戳（ISO 格式） */
  timestamp: string;
}

/**
 * 全局响应转换拦截器
 * 用于将控制器返回的数据包装成统一的响应格式
 * @template T 控制器返回数据的类型
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  /**
   * 拦截器核心方法
   * 在控制器方法执行后，对返回数据进行统一包装
   * @param context 当前请求的上下文对象
   * @param next 调用下一个处理程序的句柄
   * @returns 经过统一格式包装后的响应数据流
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      // 将控制器返回的数据包装成统一格式
      map((data) => ({
        success: true,
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: 'Operation successful',
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
