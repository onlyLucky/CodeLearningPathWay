import { Injectable, Logger, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

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

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
      this.logger.debug(`Cache SET: ${key} - TTL: ${ttl || 'default'}`);
    } catch (error) {
      this.logger.error(`Error setting cache for key ${key}:`, error);
      throw error;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
      this.logger.debug(`Cache DEL: ${key}`);
    } catch (error) {
      this.logger.error(`Error deleting cache for key ${key}:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await this.cacheManager.clear();
      this.logger.debug('Cache CLEAR: All cache cleared');
    } catch (error) {
      this.logger.error('Error clearing cache:', error);
      throw error;
    }
  }

  async mget<T>(keys: string[]): Promise<(T | undefined)[]> {
    try {
      const values = await Promise.all(keys.map((key) => this.get<T>(key)));
      return values;
    } catch (error) {
      this.logger.error(`Error getting multiple cache keys:`, error);
      return keys.map(() => undefined);
    }
  }

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

  generateKey(
    prefix: string,
    identifier: string | number,
    ...suffixes: string[]
  ): string {
    const parts = [prefix, String(identifier), ...suffixes];
    return parts.join(':');
  }

  generateUserKey(
    userId: number,
    resource: string,
    ...suffixes: string[]
  ): string {
    return this.generateKey('user', userId, resource, ...suffixes);
  }

  generateTodoKey(
    todoId: number,
    resource: string,
    ...suffixes: string[]
  ): string {
    return this.generateKey('todo', todoId, resource, ...suffixes);
  }

  generateListKey(prefix: string, filters: Record<string, any> = {}): string {
    const filterString = Object.entries(filters)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    return this.generateKey(prefix, 'list', filterString);
  }
}
