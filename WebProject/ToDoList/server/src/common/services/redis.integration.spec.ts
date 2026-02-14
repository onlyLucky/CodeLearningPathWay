import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisService } from './redis.service';
import { redisConfig } from '../../config/redis.config';

describe('Redis Integration', () => {
  let app: INestApplication;
  let redisService: RedisService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [redisConfig],
        }),
        CacheModule.register({
          store: 'memory',
          ttl: 60,
        }),
      ],
      providers: [RedisService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    redisService = app.get<RedisService>(RedisService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Basic Operations', () => {
    it('should set and get a value', async () => {
      const key = 'test:key';
      const value = { name: 'test', value: 123 };

      await redisService.set(key, value, 10);
      const retrieved = await redisService.get(key);

      expect(retrieved).toEqual(value);
    });

    it('should return undefined for non-existent key', async () => {
      const result = await redisService.get('non:existent:key');
      expect(result).toBeUndefined();
    });

    it('should delete a key', async () => {
      const key = 'test:delete';
      await redisService.set(key, { data: 'test' });

      await redisService.del(key);
      const result = await redisService.get(key);

      expect(result).toBeUndefined();
    });

    it('should clear all cache', async () => {
      await redisService.set('test:1', { data: '1' });
      await redisService.set('test:2', { data: '2' });

      await redisService.clear();

      const result1 = await redisService.get('test:1');
      const result2 = await redisService.get('test:2');

      expect(result1).toBeUndefined();
      expect(result2).toBeUndefined();
    });
  });

  describe('Advanced Operations', () => {
    it('should get or set value', async () => {
      const key = 'test:getorset';
      const factory = jest.fn().mockResolvedValue({ computed: true });

      const result1 = await redisService.getOrSet(key, factory);
      const result2 = await redisService.getOrSet(key, factory);

      expect(result1).toEqual({ computed: true });
      expect(result2).toEqual({ computed: true });
      expect(factory).toHaveBeenCalledTimes(1);
    });

    it('should check key existence', async () => {
      const key = 'test:exists';

      const existsBefore = await redisService.exists(key);
      expect(existsBefore).toBe(false);

      await redisService.set(key, { data: 'test' });

      const existsAfter = await redisService.exists(key);
      expect(existsAfter).toBe(true);
    });

    it('should handle multiple get operations', async () => {
      const keys = ['test:mget:1', 'test:mget:2', 'test:mget:3'];

      await redisService.set(keys[0]!, { id: 1 });
      await redisService.set(keys[1]!, { id: 2 });

      const results = await redisService.mget(keys);

      expect(results[0]).toEqual({ id: 1 });
      expect(results[1]).toEqual({ id: 2 });
      expect(results[2]).toBeUndefined();
    });

    it('should handle multiple set operations', async () => {
      const entries = [
        { key: 'test:mset:1', value: { id: 1 } },
        { key: 'test:mset:2', value: { id: 2 } },
      ];

      await redisService.mset(entries);

      const result1 = await redisService.get('test:mset:1');
      const result2 = await redisService.get('test:mset:2');

      expect(result1).toEqual({ id: 1 });
      expect(result2).toEqual({ id: 2 });
    });
  });

  describe('Key Generation', () => {
    it('should generate consistent user keys', () => {
      const key1 = redisService.generateUserKey(123, 'profile');
      const key2 = redisService.generateUserKey(123, 'profile');

      expect(key1).toBe(key2);
      expect(key1).toBe('user:123:profile');
    });

    it('should generate consistent todo keys', () => {
      const key1 = redisService.generateTodoKey(456, 'details');
      const key2 = redisService.generateTodoKey(456, 'details');

      expect(key1).toBe(key2);
      expect(key1).toBe('todo:456:details');
    });

    it('should generate consistent list keys', () => {
      const filters = { status: 'pending', userId: 123 };
      const key1 = redisService.generateListKey('todos', filters);
      const key2 = redisService.generateListKey('todos', filters);

      expect(key1).toBe(key2);
      expect(key1).not.toBeUndefined();
    });
  });
});
