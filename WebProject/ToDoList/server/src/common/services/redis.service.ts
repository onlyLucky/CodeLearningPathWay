import { Injectable, Logger, Inject } from '@nestjs/common';
// 引入 Redis 模块的 CACHE_MANAGER 常量，用于注入 Redis 缓存管理器
import { CACHE_MANAGER } from '@nestjs/cache-manager';
// 引入 Cache 类型以定义缓存值类型
import { Cache } from 'cache-manager';

/**
 * Redis 缓存服务封装
 * 提供统一的缓存读写、删除、批量操作及键名生成能力
 */
@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    /** 注入 NestJS 缓存管理器（底层驱动可为 Redis 等） */
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * 读取缓存
   * @param key 缓存键
   * @returns 命中则返回对应值，否则返回 undefined
   */
  async get<T>(key: string): Promise<T | undefined> {
    try {
      const value = await this.cacheManager.get<T>(key);
      this.logger.debug(`Cache GET: ${key} - ${value ? 'HIT' : 'MISS'}`);
      return value;
    } catch (error) {
      this.logger.error(`Error getting cache for key ${key}:`, error);
      return undefined;
    }
  }

  /**
   * 写入缓存
   * @param key 缓存键
   * @param value 待缓存值
   * @param ttl 过期时间（秒）；不传则使用默认 TTL
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
      this.logger.debug(`Cache SET: ${key} - TTL: ${ttl || 'default'}`);
    } catch (error) {
      this.logger.error(`Error setting cache for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * 删除单个缓存键
   * @param key 缓存键
   */
  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
      this.logger.debug(`Cache DEL: ${key}`);
    } catch (error) {
      this.logger.error(`Error deleting cache for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * 清空全部缓存（慎用）
   */
  async clear(): Promise<void> {
    try {
      await this.cacheManager.clear();
      this.logger.debug('Cache CLEAR: All cache cleared');
    } catch (error) {
      this.logger.error('Error clearing cache:', error);
      throw error;
    }
  }

  /**
   * 批量读取缓存
   * @param keys 键数组
   * @returns 与键顺序对应的值数组，未命中为 undefined
   */
  async mget<T>(keys: string[]): Promise<(T | undefined)[]> {
    try {
      const values = await Promise.all(keys.map((key) => this.get<T>(key)));
      return values;
    } catch (error) {
      this.logger.error(`Error getting multiple cache keys:`, error);
      return keys.map(() => undefined);
    }
  }

  /**
   * 批量写入缓存
   * @param entries 键值对数组
   * @param ttl 过期时间（秒）
   */
  async mset<T>(
    entries: Array<{ key: string; value: T }>,
    ttl?: number,
  ): Promise<void> {
    try {
      await Promise.all(
        entries.map((entry) => this.set(entry.key, entry.value, ttl)),
      );
      this.logger.debug(`Cache MSET: ${entries.length} entries`);
    } catch (error) {
      this.logger.error('Error setting multiple cache entries:', error);
      throw error;
    }
  }

  /**
   * 判断缓存键是否存在
   * @param key 缓存键
   * @returns 存在返回 true，否则 false
   */
  async exists(key: string): Promise<boolean> {
    try {
      const value = await this.get(key);
      return value !== undefined;
    } catch (error) {
      this.logger.error(
        `Error checking cache existence for key ${key}:`,
        error,
      );
      return false;
    }
  }

  /**
   * 获取缓存，若未命中则执行 factory 写入并返回
   * @param key 缓存键
   * @param factory 未命中时的数据生成函数
   * @param ttl 过期时间（秒）
   * @returns 缓存值
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    try {
      const cachedValue = await this.get<T>(key);
      if (cachedValue !== undefined) {
        return cachedValue;
      }

      const value = await factory();
      await this.set(key, value, ttl);
      return value;
    } catch (error) {
      this.logger.error(`Error in getOrSet for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * 通用键名生成器
   * @param prefix 前缀
   * @param identifier 标识符
   * @param suffixes 可选后缀
   * @returns 以冒号分隔的完整键名
   * @example generateKey('user', 123, 'profile') => 'user:123:profile'
   */
  generateKey(
    prefix: string,
    identifier: string | number,
    ...suffixes: string[]
  ): string {
    const parts = [prefix, String(identifier), ...suffixes];
    return parts.join(':');
  }

  /**
   * 生成用户维度缓存键
   * @param userId 用户 ID
   * @param resource 资源名
   * @param suffixes 可选后缀
   * @returns 用户缓存键
   * @example generateUserKey(123, 'settings') => 'user:123:settings'
   */
  generateUserKey(
    userId: number,
    resource: string,
    ...suffixes: string[]
  ): string {
    return this.generateKey('user', userId, resource, ...suffixes);
  }

  /**
   * 生成待办维度缓存键
   * @param todoId 待办 ID
   * @param resource 资源名
   * @param suffixes 可选后缀
   * @returns 待办缓存键
   * @example generateTodoKey(456, 'detail') => 'todo:456:detail'
   */
  generateTodoKey(
    todoId: number,
    resource: string,
    ...suffixes: string[]
  ): string {
    return this.generateKey('todo', todoId, resource, ...suffixes);
  }

  /**
   * 生成列表缓存键（含查询参数）
   * @param prefix 前缀
   * @param filters 查询过滤条件
   * @returns 列表缓存键
   * @example generateListKey('task', {status: 'done', page: 1}) => 'task:list:page=1&status=done'
   */
  generateListKey(prefix: string, filters: Record<string, any> = {}): string {
    const filterString = Object.entries(filters)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    return this.generateKey(prefix, 'list', filterString);
  }
}
