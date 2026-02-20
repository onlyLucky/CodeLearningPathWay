import { ApiResponse, ErrorResponse } from '../interfaces';
import { HTTP_STATUS } from '../constants';
import { formatDateTime } from './date.util';

/**
 * 生成成功响应
 * @param data 返回的数据
 * @param message 自定义成功消息，默认为 "Operation successful"
 * @param code 自定义状态码，默认为 HTTP_STATUS.OK
 * @returns 包装后的成功响应对象
 */
export const successResponse = <T>(
  data: T,
  message: string = 'Operation successful',
  code: number = HTTP_STATUS.OK,
): ApiResponse<T> => {
  return {
    success: true,
    code,
    message,
    data,
    timestamp: formatDateTime(new Date(), 'YYYY-MM-DD hh:mm:ss'),
  };
};

/**
 * 生成通用错误响应
 * @param message 错误描述信息
 * @param code 自定义状态码，默认为 HTTP_STATUS.INTERNAL_SERVER_ERROR
 * @param error 可选的详细错误类型标识
 * @returns 包装后的错误响应对象
 */
export const errorResponse = (
  message: string,
  code: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  error?: string,
): ErrorResponse => {
  return {
    success: false,
    code,
    data: null,
    message,
    error,
    timestamp: formatDateTime(new Date(), 'YYYY-MM-DD hh:mm:ss'),
  };
};

/**
 * 生成“已创建”成功响应（201）
 * @param data 新创建的资源数据
 * @param message 自定义成功消息，默认为 "Resource created successfully"
 * @returns 包装后的成功响应对象
 */
export const createdResponse = <T>(
  data: T,
  message: string = 'Resource created successfully',
): ApiResponse<T> => {
  return successResponse(data, message, HTTP_STATUS.CREATED);
};

/**
 * 生成“无内容”成功响应（204）
 * @returns 仅含状态的成功响应对象
 */
export const noContentResponse = (): ApiResponse => {
  return {
    success: true,
    code: HTTP_STATUS.OK,
    data: '',
    message: 'Operation successful123',
    timestamp: formatDateTime(new Date(), 'YYYY-MM-DD hh:mm:ss'),
  };
};

/**
 * 生成“资源未找到”错误响应（404）
 * @param message 自定义错误消息，默认为 "Resource not found"
 * @returns 包装后的错误响应对象
 */
export const notFoundResponse = (
  message: string = 'Resource not found',
): ErrorResponse => {
  return errorResponse(message, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
};

/**
 * 生成“请求错误”错误响应（400）
 * @param message 自定义错误消息，默认为 "Bad request"
 * @returns 包装后的错误响应对象
 */
export const badRequestResponse = (
  message: string = 'Bad request',
): ErrorResponse => {
  return errorResponse(message, HTTP_STATUS.BAD_REQUEST, 'BAD_REQUEST');
};

/**
 * 生成“未授权”错误响应（401）
 * @param message 自定义错误消息，默认为 "Unauthorized"
 * @returns 包装后的错误响应对象
 */
export const unauthorizedResponse = (
  message: string = 'Unauthorized',
): ErrorResponse => {
  return errorResponse(message, HTTP_STATUS.UNAUTHORIZED, 'UNAUTHORIZED');
};

/**
 * 生成“权限不足”错误响应（403）
 * @param message 自定义错误消息，默认为 "Forbidden"
 * @returns 包装后的错误响应对象
 */
export const forbiddenResponse = (
  message: string = 'Forbidden',
): ErrorResponse => {
  return errorResponse(message, HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
};

/**
 * 生成“资源冲突”错误响应（409）
 * @param message 自定义错误消息，默认为 "Conflict"
 * @returns 包装后的错误响应对象
 */
export const conflictResponse = (
  message: string = 'Conflict',
): ErrorResponse => {
  return errorResponse(message, HTTP_STATUS.CONFLICT, 'CONFLICT');
};

/**
 * 生成“服务器内部错误”错误响应（500）
 * @param message 自定义错误消息，默认为 "Internal server error"
 * @returns 包装后的错误响应对象
 */
export const internalServerErrorResponse = (
  message: string = 'Internal server error',
): ErrorResponse => {
  return errorResponse(
    message,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    'INTERNAL_SERVER_ERROR',
  );
};
