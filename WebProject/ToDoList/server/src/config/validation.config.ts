import { ValidationPipe, BadRequestException } from '@nestjs/common';

/**
 * 全局验证管道配置
 */
export const validationPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
  exceptionFactory: (errors) => {
    const messages = errors.map(
      (error) =>
        `${error.property}: ${Object.values(error.constraints || {}).join(', ')}`,
    );
    return new BadRequestException(messages.join('; '));
  },
});
