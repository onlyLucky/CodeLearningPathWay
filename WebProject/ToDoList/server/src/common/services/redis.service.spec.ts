import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';

describe('RedisService', () => {
  let service: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: RedisService,
          useFactory: () => {
            const mockCacheManager = {
              get: jest.fn(),
              set: jest.fn(),
              del: jest.fn(),
              clear: jest.fn(),
              mget: jest.fn(),
              mset: jest.fn(),
              ttl: jest.fn(),
              mdel: jest.fn(),
              wrap: jest.fn(),
              store: {},
            };
            return new RedisService(mockCacheManager as any);
          },
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateKey', () => {
    it('should generate key with prefix and identifier', () => {
      const key = service.generateKey('user', 123);
      expect(key).toBe('user:123');
    });

    it('should generate key with prefix, identifier and suffixes', () => {
      const key = service.generateKey('user', 123, 'profile', 'details');
      expect(key).toBe('user:123:profile:details');
    });
  });

  describe('generateUserKey', () => {
    it('should generate user-specific key', () => {
      const key = service.generateUserKey(123, 'profile');
      expect(key).toBe('user:123:profile');
    });

    it('should generate user-specific key with suffixes', () => {
      const key = service.generateUserKey(123, 'todos', 'status=pending');
      expect(key).toBe('user:123:todos:status=pending');
    });
  });

  describe('generateTodoKey', () => {
    it('should generate todo-specific key', () => {
      const key = service.generateTodoKey(456, 'details');
      expect(key).toBe('todo:456:details');
    });
  });

  describe('generateListKey', () => {
    it('should generate list key without filters', () => {
      const key = service.generateListKey('todos');
      expect(key).toBe('todos:list:');
    });

    it('should generate list key with filters', () => {
      const key = service.generateListKey('todos', {
        status: 'pending',
        userId: 123,
      });
      expect(key).toBe('todos:list:status=pending&userId=123');
    });

    it('should sort filter keys consistently', () => {
      const key1 = service.generateListKey('todos', { b: 2, a: 1 });
      const key2 = service.generateListKey('todos', { a: 1, b: 2 });
      expect(key1).toBe(key2);
    });
  });
});
