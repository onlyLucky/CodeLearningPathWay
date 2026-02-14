import { registerAs } from '@nestjs/config';
import { CacheModuleOptions } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

export interface RedisConfig {
  host: string;
  port: number;
  password: string;
  db: number;
  ttl: number;
  maxRetries: number;
  retryDelay: number;
}

export const redisConfig = registerAs<RedisConfig>('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || '',
  db: parseInt(process.env.REDIS_DB || '0', 10),
  ttl: parseInt(process.env.REDIS_TTL || '3600', 10),
  maxRetries: parseInt(process.env.REDIS_MAX_RETRIES || '3', 10),
  retryDelay: parseInt(process.env.REDIS_RETRY_DELAY || '1000', 10),
}));

export const getCacheModuleOptions = (): CacheModuleOptions => ({
  isGlobal: true,
  useFactory: (config: RedisConfig) => ({
    store: redisStore,
    host: config.host,
    port: config.port,
    password: config.password || undefined,
    db: config.db,
    ttl: config.ttl,
    max: config.maxRetries,
    retry_strategy: (options: any) => {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        return (
          Math.min(options.attempt + 1, config.maxRetries) * config.retryDelay
        );
      }
      return config.retryDelay;
    },
  }),
  inject: [redisConfig.KEY],
});
