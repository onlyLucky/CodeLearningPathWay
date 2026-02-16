import { ValidationPipe, BadRequestException } from '@nestjs/common';

/**
 * 全局验证管道配置
 * 用于自动验证和转换所有传入的请求数据
 * 配置项说明：
 * - whitelist: 只保留 DTO 中声明的属性，剔除未声明的属性
 * - forbidNonWhitelisted: 若请求体中存在未声明的属性，直接抛出异常
 * - transform: 自动将有效负载转换为 DTO 实例
 * - transformOptions.enableImplicitConversion: 开启隐式类型转换（如字符串转数字）
 * - exceptionFactory: 自定义错误信息格式，将多个字段错误合并为一条字符串
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
