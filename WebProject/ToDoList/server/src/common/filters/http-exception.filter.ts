import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  LoggerService,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  errorResponse,
  badRequestResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  conflictResponse,
  internalServerErrorResponse,
} from '../utils/response.util';

/**
 * 全局 HTTP 异常过滤器
 * 捕获所有未处理的异常，统一格式后返回给客户端，并记录日志
 *
 * 使用方式：
 * 1. 全局注册：在主模块（如 app.module.ts）中使用 `app.useGlobalFilters(new HttpExceptionFilter(logger));`
 * 2. 局部注册：在具体控制器或路由处理器上使用 `@UseFilters(new HttpExceptionFilter(logger))` 装饰器
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  /**
   * 异常捕获处理方法
   * @param exception 捕获到的异常对象
   * @param host 当前请求的上下文对象
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    let message = 'Internal server error';
    let errorType: string | undefined;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null
    ) {
      const responseObj = exceptionResponse as any;
      message = responseObj.message || 'Internal server error';
      errorType = responseObj.error;
    }

    const errorResponseData = this.getErrorResponse(status, message, errorType);

    this.logger.error({
      ...errorResponseData,
      path: request.url,
      method: request.method,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    response.status(status).json(errorResponseData);
  }

  private getErrorResponse(
    status: number,
    message: string,
    errorType?: string,
  ): any {
    const statusCode = status as HttpStatus;
    switch (statusCode) {
      case HttpStatus.BAD_REQUEST:
        return badRequestResponse(message);
      case HttpStatus.UNAUTHORIZED:
        return unauthorizedResponse(message);
      case HttpStatus.FORBIDDEN:
        return forbiddenResponse(message);
      case HttpStatus.NOT_FOUND:
        return notFoundResponse(message);
      case HttpStatus.CONFLICT:
        return conflictResponse(message);
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return internalServerErrorResponse(message);
      default:
        return errorResponse(message, status, errorType);
    }
  }
}
