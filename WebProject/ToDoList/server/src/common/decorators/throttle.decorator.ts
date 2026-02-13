import { SetMetadata } from '@nestjs/common';

/**
 * 限流元数据键名，用于在装饰器中标识限流配置
 */
export const THROTTLE_KEY = 'throttle';

/**
 * 限流装饰器，用于在控制器或路由处理器上设置限流规则
 * @param limit - 在 ttl 时间窗口内允许的最大请求次数
 * @param ttl - 时间窗口（单位：秒）
 * @returns 返回一个自定义元数据装饰器
 * @example
 * @Throttle(10, 60)
 * updateResource() { ... }
 */
export const Throttle = (limit: number, ttl: number) =>
  SetMetadata(THROTTLE_KEY, { limit, ttl });
