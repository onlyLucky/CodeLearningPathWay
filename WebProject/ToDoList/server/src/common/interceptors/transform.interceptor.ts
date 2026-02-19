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
import { formatDateTime } from '../utils/date.util';

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

        const formattedData = this.formatDates(data);
        return this.getSuccessResponse(statusCode, formattedData);
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

  private formatDates(data: any): any {
    if (!data) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.formatDates(item));
    }

    if (data instanceof Date) {
      return formatDateTime(data, 'YYYY-MM-DD hh:mm:ss');
    }

    if (typeof data === 'object') {
      const result: any = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const value = data[key];
          if (
            value instanceof Date ||
            (this.isDateString(value) &&
              (key.includes('date') ||
                key.includes('Date') ||
                key.includes('time') ||
                key.includes('Time') ||
                key === 'timestamp'))
          ) {
            result[key] = formatDateTime(value, 'YYYY-MM-DD hh:mm:ss');
          } else {
            result[key] = this.formatDates(value);
          }
        }
      }
      return result;
    }

    return data;
  }

  private isDateString(value: any): boolean {
    return (
      value instanceof Date ||
      (typeof value === 'string' &&
        !isNaN(Date.parse(value)) &&
        /^\d{4}-\d{2}-\d{2}/.test(value))
    );
  }
}
