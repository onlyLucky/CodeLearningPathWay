# Redis 集成文档

## 概述

本项目已成功集成 Redis 缓存功能，提供高性能的数据缓存服务，用于提升应用性能和响应速度。

## 架构设计

### 核心组件

1. **RedisService** - 统一的缓存服务接口
2. **Redis 配置模块** - 环境差异化配置
3. **缓存集成** - 在业务服务中应用缓存策略
4. **限流守卫** - 基于 Redis 的请求限流

### 缓存策略

- **用户数据缓存**: 用户档案信息缓存
- **列表数据缓存**: Todo 列表按状态缓存
- **缓存失效**: 数据变更时自动失效相关缓存
- **TTL 管理**: 不同环境使用不同的过期时间

## 配置说明

### 环境变量

| 变量名 | 说明 | 开发环境 | 测试环境 | 生产环境 |
|---------|------|-----------|-----------|-----------|
| REDIS_HOST | Redis 服务器地址 | localhost | localhost | redis |
| REDIS_PORT | Redis 端口 | 6379 | 6380 | 6379 |
| REDIS_PASSWORD | Redis 密码 | 空 | 空 | 生产密码 |
| REDIS_DB | Redis 数据库编号 | 0 | 1 | 0 |
| REDIS_TTL | 默认缓存过期时间(秒) | 3600 | 600 | 7200 |
| REDIS_MAX_RETRIES | 最大重试次数 | 3 | 2 | 5 |
| REDIS_RETRY_DELAY | 重试延迟(毫秒) | 1000 | 500 | 2000 |

### 配置文件

- **[redis.config.ts](file:///Users/feynman/Documents/code/2026/CodeLearningPathWay/WebProject/ToDoList/server/src/config/redis.config.ts)** - Redis 配置模块
- **[.env.development](file:///Users/feynman/Documents/code/2026/CodeLearningPathWay/WebProject/ToDoList/server/.env.development)** - 开发环境配置
- **[.env.test](file:///Users/feynman/Documents/code/2026/CodeLearningPathWay/WebProject/ToDoList/server/.env.test)** - 测试环境配置
- **[.env.production](file:///Users/feynman/Documents/code/2026/CodeLearningPathWay/WebProject/ToDoList/server/.env.production)** - 生产环境配置

## RedisService API

### 基础操作

```typescript
// 设置缓存
await redisService.set('key', { data: 'value' }, 3600);

// 获取缓存
const value = await redisService.get('key');

// 删除缓存
await redisService.del('key');

// 清空所有缓存
await redisService.clear();
```

### 高级操作

```typescript
// 检查键是否存在
const exists = await redisService.exists('key');

// 获取或设置（缓存穿透保护）
const value = await redisService.getOrSet('key', async () => {
  return await fetchFromDatabase();
}, 3600);

// 批量获取
const values = await redisService.mget(['key1', 'key2', 'key3']);

// 批量设置
await redisService.mset([
  { key: 'key1', value: { data: 1 } },
  { key: 'key2', value: { data: 2 } }
], 3600);
```

### 键生成工具

```typescript
// 生成用户相关键
const userKey = redisService.generateUserKey(123, 'profile');
// 结果: user:123:profile

// 生成 Todo 相关键
const todoKey = redisService.generateTodoKey(456, 'details');
// 结果: todo:456:details

// 生成列表键（带过滤器）
const listKey = redisService.generateListKey('todos', { status: 'pending', userId: 123 });
// 结果: todos:list:status=pending&userId=123
```

## 业务集成

### UsersService 集成

在 [UsersService](file:///Users/feynman/Documents/code/2026/CodeLearningPathWay/WebProject/ToDoList/server/src/modules/users/users.service.ts) 中：

```typescript
async findOne(id: number): Promise<User> {
  const cacheKey = this.redisService.generateUserKey(id, 'profile');
  const cachedUser = await this.redisService.get<User>(cacheKey);
  
  if (cachedUser) {
    return cachedUser;
  }

  const user = await this.userRepository.findOne({ where: { id } });
  await this.redisService.set(cacheKey, user);
  return user;
}
```

### TodosService 集成

在 [TodosService](file:///Users/feynman/Documents/code/2026/CodeLearningPathWay/WebProject/ToDoList/server/src/modules/todos/todos.service.ts) 中：

```typescript
// 列表查询缓存
async findAll(userId: number, status?: string): Promise<Todo[]> {
  const cacheKey = this.redisService.generateUserKey(userId, 'todos', status ? `status=${status}` : '');
  const cachedTodos = await this.redisService.get<Todo[]>(cacheKey);
  
  if (cachedTodos) {
    return cachedTodos;
  }

  const todos = await this.todoRepository.find({ where: { userId } });
  await this.redisService.set(cacheKey, todos);
  return todos;
}

// 缓存失效策略
private async invalidateUserTodosCache(userId: number): Promise<void> {
  const keys = [
    this.redisService.generateUserKey(userId, 'todos'),
    this.redisService.generateUserKey(userId, 'todos', 'status=pending'),
    this.redisService.generateUserKey(userId, 'todos', 'status=in_progress'),
    this.redisService.generateUserKey(userId, 'todos', 'status=completed'),
  ];
  
  await Promise.all(keys.map((key) => this.redisService.del(key)));
}
```

### ThrottlerGuard 集成

在 [ThrottlerGuard](file:///Users/feynman/Documents/code/2026/CodeLearningPathWay/WebProject/ToDoList/server/src/common/guards/throttler.guard.ts) 中：

```typescript
async canActivate(context: ExecutionContext): Promise<boolean> {
  const key = `${request.method}-${request.url}-${ip}`;
  const record = await this.getRecord(key);
  
  if (record && record.totalHits >= limit) {
    throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
  }
  
  await this.incrementRecord(key, ttl);
  return true;
}
```

## Docker 集成

### 开发环境

在 [docker-compose.dev.yml](file:///Users/feynman/Documents/code/2026/CodeLearningPathWay/WebProject/ToDoList/server/docker-compose.dev.yml) 中：

```yaml
redis:
  image: redis:7-alpine
  container_name: todolist-redis-dev
  restart: unless-stopped
  ports:
    - "6379:6379"
  volumes:
    - redis_dev_data:/data
  networks:
    - todolist-dev-network
  command: redis-server --appendonly yes

app:
  environment:
    REDIS_HOST: redis
    REDIS_PORT: 6379
    REDIS_PASSWORD:
    REDIS_DB: 0
    REDIS_TTL: 3600
    REDIS_MAX_RETRIES: 3
    REDIS_RETRY_DELAY: 1000
  depends_on:
    - redis
```

### 生产环境

在 [docker-compose.yml](file:///Users/feynman/Documents/code/2026/CodeLearningPathWay/WebProject/ToDoList/server/docker-compose.yml) 中：

```yaml
redis:
  image: redis:7-alpine
  container_name: todolist-redis
  restart: unless-stopped
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data
  networks:
    - todolist-network
  command: redis-server --appendonly yes --requirepass your-redis-password-change-in-production
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
    interval: 10s
    timeout: 5s
    retries: 5
```

## 测试

### 单元测试

运行 Redis 服务单元测试：

```bash
pnpm test src/common/services/redis.service.spec.ts
```

测试覆盖：
- ✅ 键生成功能
- ✅ 用户键生成
- ✅ Todo 键生成
- ✅ 列表键生成
- ✅ 过滤器排序一致性

### 集成测试

运行 Redis 集成测试：

```bash
pnpm test src/common/services/redis.integration.spec.ts
```

测试覆盖：
- ✅ 基础缓存操作（设置、获取、删除、清空）
- ✅ 高级缓存操作（获取或设置、存在性检查、批量操作）
- ✅ 键生成一致性

## 性能优化

### 缓存命中率监控

```typescript
// 在 RedisService 中自动记录
this.logger.debug(`Cache GET: ${key} - ${value ? 'HIT' : 'MISS'}`);
```

### 缓存策略

1. **读多写少**: 使用较长 TTL（如 3600 秒）
2. **频繁变更**: 使用较短 TTL（如 600 秒）
3. **实时数据**: 不使用缓存
4. **列表数据**: 按状态分键，提高缓存命中率

### 批量操作

使用批量操作减少网络往返：

```typescript
// 不推荐：多次单独操作
for (const item of items) {
  await redisService.set(item.key, item.value);
}

// 推荐：批量操作
await redisService.mset(items.map(item => ({ key: item.key, value: item.value })));
```

## 故障排查

### 连接失败

```bash
# 检查 Redis 容器状态
docker ps | grep redis

# 查看 Redis 日志
docker logs todolist-redis-dev

# 测试 Redis 连接
redis-cli -h localhost -p 6379 ping
```

### 缓存不生效

1. 检查环境变量配置
2. 验证 Redis 连接
3. 查看应用日志中的缓存 HIT/MISS 信息
4. 检查 TTL 设置是否合理

### 性能问题

1. 监控 Redis 内存使用：`redis-cli info memory`
2. 检查慢查询：`redis-cli slowlog get 10`
3. 优化键命名策略，减少键冲突
4. 调整 TTL 和缓存策略

## 最佳实践

1. **键命名规范**: 使用 `prefix:identifier:resource` 格式
2. **TTL 设置**: 根据数据更新频率设置合理的过期时间
3. **缓存失效**: 数据变更时及时失效相关缓存
4. **错误处理**: 缓存失败时降级到数据库查询
5. **监控告警**: 监控缓存命中率和 Redis 性能指标
6. **安全考虑**: 生产环境使用密码认证
7. **数据持久化**: 使用 AOF 持久化保证数据安全
8. **容量规划**: 根据业务量预估 Redis 内存需求

## 监控指标

建议监控以下指标：

- **缓存命中率**: HIT / (HIT + MISS)
- **内存使用率**: used_memory / maxmemory
- **连接数**: connected_clients
- **命令执行**: total_commands_processed
- **慢查询**: slowlog_length
- **键空间**: db0:keys
