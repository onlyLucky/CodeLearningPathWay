import { ApiResponse, ErrorResponse } from '../interfaces';
import { HTTP_STATUS } from '../constants';

export const successResponse = <T>(
  data: T,
  message: string = 'Operation successful',
  statusCode: number = HTTP_STATUS.OK,
): ApiResponse<T> => {
  return {
    success: true,
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};

export const errorResponse = (
  message: string,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  error?: string,
): ErrorResponse => {
  return {
    success: false,
    statusCode,
    message,
    error,
    timestamp: new Date().toISOString(),
  };
};

export const createdResponse = <T>(
  data: T,
  message: string = 'Resource created successfully',
): ApiResponse<T> => {
  return successResponse(data, message, HTTP_STATUS.CREATED);
};

export const noContentResponse = (): ApiResponse => {
  return {
    success: true,
    statusCode: HTTP_STATUS.NO_CONTENT,
    message: 'Operation successful',
    timestamp: new Date().toISOString(),
  };
};

export const notFoundResponse = (
  message: string = 'Resource not found',
): ErrorResponse => {
  return errorResponse(message, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
};

export const badRequestResponse = (
  message: string = 'Bad request',
): ErrorResponse => {
  return errorResponse(message, HTTP_STATUS.BAD_REQUEST, 'BAD_REQUEST');
};

export const unauthorizedResponse = (
  message: string = 'Unauthorized',
): ErrorResponse => {
  return errorResponse(message, HTTP_STATUS.UNAUTHORIZED, 'UNAUTHORIZED');
};

export const forbiddenResponse = (
  message: string = 'Forbidden',
): ErrorResponse => {
  return errorResponse(message, HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
};

export const conflictResponse = (
  message: string = 'Conflict',
): ErrorResponse => {
  return errorResponse(message, HTTP_STATUS.CONFLICT, 'CONFLICT');
};

export const internalServerErrorResponse = (
  message: string = 'Internal server error',
): ErrorResponse => {
  return errorResponse(
    message,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    'INTERNAL_SERVER_ERROR',
  );
};
