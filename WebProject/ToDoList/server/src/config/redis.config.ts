/**
 * Redis 配置相关模块
 * 提供 Redis 连接参数及缓存模块选项的封装，支持环境变量注入
 */

import { registerAs } from '@nestjs/config';
import { CacheModuleOptions } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

/**
 * Redis 配置接口
 * 定义 Redis 连接与缓存行为所需字段
 */
export interface RedisConfig {
  /** Redis 服务器地址 */
  host: string;
  /** Redis 服务器端口 */
  port: number;
  /** Redis 认证密码 */
  password: string;
  /** 使用的数据库编号 */
  db: number;
  /** 缓存全局过期时间（秒） */
  ttl: number;
  /** 最大重试次数 */
  maxRetries: number;
  /** 重试延迟（毫秒） */
  retryDelay: number;
}

/**
 * Redis 配置工厂
 * 从环境变量读取并解析 Redis 连接参数，提供默认值
 */
export const redisConfig = registerAs<RedisConfig>('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || '',
  db: parseInt(process.env.REDIS_DB || '0', 10),
  ttl: parseInt(process.env.REDIS_TTL || '3600', 10),
  maxRetries: parseInt(process.env.REDIS_MAX_RETRIES || '3', 10),
  retryDelay: parseInt(process.env.REDIS_RETRY_DELAY || '1000', 10),
}));

/**
 * 生成 NestJS CacheModule 的异步配置选项
 * 注入 redisConfig，提供 Redis 存储后端及重试策略
 */
export const getCacheModuleOptions = (): CacheModuleOptions => ({
  // 声明为全局模块，避免在每个模块重复导入
  isGlobal: true,
  useFactory: (config: RedisConfig) => ({
    // 指定使用 cache-manager-redis-store
    store: redisStore,
    host: config.host,
    port: config.port,
    // 空密码时传 undefined，避免 Redis 客户端报错
    password: config.password || undefined,
    db: config.db,
    ttl: config.ttl,
    // 对应 redis-store 的 max 参数，控制连接重试
    max: config.maxRetries,
    /**
     * 自定义重试策略
     * 当连接被拒绝时，按指数退避策略延迟重试
     * @param options 重试信息对象
     * @returns 下次重试延迟（毫秒）
     */
    retry_strategy: (options: any) => {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        return (
          Math.min(options.attempt + 1, config.maxRetries) * config.retryDelay
        );
      }
      return config.retryDelay;
    },
  }),
  // 注入 redisConfig 的 token，使 useFactory 可获取配置
  inject: [redisConfig.KEY],
});
