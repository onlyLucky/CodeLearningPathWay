import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  LoggerService,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * 全局 HTTP 异常过滤器
 * 捕获所有未处理的异常，统一格式后返回给客户端，并记录日志
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
    // 获取 HTTP 上下文
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 确定 HTTP 状态码：如果是 HttpException 则取其状态码，否则默认为 500
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 获取异常消息：如果是 HttpException 则取其响应体，否则使用默认消息
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // 构造统一的错误响应对象
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof message === 'string'
          ? message
          : (message as any).message || 'Internal server error',
      error: typeof message === 'object' ? (message as any).error : undefined,
    };

    // 记录错误日志，包含堆栈信息（如果异常是 Error 实例）
    this.logger.error({
      ...errorResponse,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    // 返回统一格式的 JSON 响应给客户端
    response.status(status).json({
      code: status,
      message: errorResponse.message
    });
  }
}
