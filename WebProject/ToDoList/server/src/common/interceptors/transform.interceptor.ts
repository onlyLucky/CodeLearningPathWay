import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces';
import {
  successResponse,
  createdResponse,
  noContentResponse,
} from '../utils/response.util';

/**
 * 全局响应转换拦截器
 * 用于将控制器返回的数据包装成统一的响应格式
 * @template T 控制器返回数据的类型
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
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
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        return this.getSuccessResponse(statusCode, data);
      }),
    );
  }

  private getSuccessResponse<T>(statusCode: number, data: T): ApiResponse<T> {
    const httpStatus = statusCode as HttpStatus;
    switch (httpStatus) {
      case HttpStatus.CREATED:
        return createdResponse(data);
      case HttpStatus.NO_CONTENT:
        return noContentResponse();
      default:
        return successResponse(data);
    }
  }
}
