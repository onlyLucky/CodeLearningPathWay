# Redis 集成测试指南

## 前置条件

- Docker 已安装并运行
- Node.js 和 pnpm 已安装
- 项目依赖已安装

## 测试步骤

### 1. 启动 Redis 服务

#### 使用 Docker Compose（推荐）

```bash
cd /Users/feynman/Documents/code/2026/CodeLearningPathWay/WebProject/ToDoList/server

# 启动开发环境
docker compose -f docker-compose.dev.yml up -d

# 查看服务状态
docker compose -f docker-compose.dev.yml ps

# 查看 Redis 日志
docker logs todolist-redis-dev
```

#### 使用本地 Redis（开发调试）

```bash
# 安装 Redis
brew install redis

# 启动 Redis
redis-server

# 测试连接
redis-cli ping
# 应返回: PONG
```

### 2. 验证 Redis 连接

```bash
# 进入 Redis 容器
docker exec -it todolist-redis-dev sh

# 连接到 Redis
redis-cli

# 测试基本命令
127.0.0.1:6379> ping
PONG

127.0.0.1:6379> set test "hello world"
OK

127.0.0.1:6379> get test
"hello world"

127.0.0.1:6379> del test
(integer) 1

127.0.0.1:6379> exit
```

### 3. 运行单元测试

```bash
cd /Users/feynman/Documents/code/2026/CodeLearningPathWay/WebProject/ToDoList/server

# 运行 Redis 服务单元测试
pnpm test src/common/services/redis.service.spec.ts

# 预期输出：
# PASS  src/common/services/redis.service.spec.ts
#   RedisService
#     ✓ should be defined
#     generateKey
#       ✓ should generate key with prefix and identifier
#       ✓ should generate key with prefix, identifier and suffixes
#     generateUserKey
#       ✓ should generate user-specific key
#       ✓ should generate user-specific key with suffixes
#     generateTodoKey
#       ✓ should generate todo-specific key
#     generateListKey
#       ✓ should generate list key without filters
#       ✓ should generate list key with filters
#       ✓ should sort filter keys consistently
# 
# Test Suites: 1 passed, 1 total
# Tests:       9 passed, 9 total
```

### 4. 运行集成测试

```bash
# 运行 Redis 集成测试
pnpm test src/common/services/redis.integration.spec.ts

# 预期输出：
# PASS  src/common/services/redis.integration.spec.ts
#   Redis Integration
#     Basic Operations
#       ✓ should set and get a value
#       ✓ should return undefined for non-existent key
#       ✓ should delete a key
#       ✓ should clear all cache
#     Advanced Operations
#       ✓ should get or set value
#       ✓ should check key existence
#       ✓ should handle multiple get operations
#       ✓ should handle multiple set operations
#     Key Generation
#       ✓ should generate consistent user keys
#       ✓ should generate consistent todo keys
#       ✓ should generate consistent list keys
# 
# Test Suites: 1 passed, 1 total
# Tests:       11 passed, 11 total
```

### 5. 启动应用服务

```bash
# 启动开发服务器
pnpm run start:dev

# 或使用 Docker
docker compose -f docker-compose.dev.yml up -d

# 查看应用日志
docker logs todolist-api-dev
```

### 6. 测试缓存功能

#### 测试用户缓存

```bash
# 创建用户（首次查询数据库）
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'

# 获取用户（从缓存读取）
curl http://localhost:3000/users/1

# 再次获取（应该命中缓存）
curl http://localhost:3000/users/1

# 检查 Redis 中的缓存
docker exec todolist-redis-dev redis-cli keys "user:*"
# 应该看到类似: "user:1:profile"
```

#### 测试 Todo 列表缓存

```bash
# 创建 Todo
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Todo",
    "description": "Test description",
    "status": "pending"
  }'

# 获取 Todo 列表（首次查询数据库）
curl http://localhost:3000/todos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 再次获取（应该命中缓存）
curl http://localhost:3000/todos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 检查 Redis 中的缓存
docker exec todolist-redis-dev redis-cli keys "user:*:todos"
# 应该看到类似: "user:1:todos"
```

#### 测试缓存失效

```bash
# 更新 Todo（应该失效缓存）
curl -X PATCH http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Updated Todo"
  }'

# 再次获取 Todo 列表（应该从数据库重新查询）
curl http://localhost:3000/todos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 检查应用日志，应该看到缓存 MISS
docker logs todolist-api-dev | grep "Cache"
```

### 7. 测试限流功能

```bash
# 快速发送多个请求测试限流
for i in {1..15}; do
  curl -s http://localhost:3000/todos \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" &
done
wait

# 检查响应头
curl -I http://localhost:3000/todos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 应该看到类似：
# X-RateLimit-Limit: 10
# X-RateLimit-Remaining: 9
# X-RateLimit-Reset: 59999
```

### 8. 性能测试

```bash
# 使用 Apache Bench 进行性能测试
ab -n 1000 -c 10 -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/todos

# 检查 Redis 性能
docker exec todolist-redis-dev redis-cli info stats

# 检查应用日志中的缓存命中率
docker logs todolist-api-dev | grep "Cache" | grep -E "(HIT|MISS)" | wc -l
```

## 验证清单

### 功能验证

- [ ] Redis 服务正常启动
- [ ] 应用成功连接到 Redis
- [ ] 单元测试全部通过（9/9）
- [ ] 集成测试全部通过（11/11）
- [ ] 用户缓存功能正常
- [ ] Todo 列表缓存功能正常
- [ ] 缓存失效策略正常工作
- [ ] 限流功能正常工作
- [ ] 缓存命中率合理（> 70%）
- [ ] 性能提升明显（对比无缓存）

### 性能验证

- [ ] 首次请求响应时间 < 500ms
- [ ] 缓存命中响应时间 < 50ms
- [ ] 并发处理能力提升 > 50%
- [ ] 数据库查询次数减少 > 60%
- [ ] Redis 内存使用合理

## 故障排查

### Redis 连接失败

```bash
# 检查 Redis 容器状态
docker ps | grep redis

# 查看 Redis 日志
docker logs todolist-redis-dev --tail 50

# 测试网络连接
docker exec todolist-api-dev ping todolist-redis-dev

# 检查环境变量
docker exec todolist-api-dev env | grep REDIS
```

### 缓存不生效

```bash
# 检查 Redis 配置
docker exec todolist-api-dev cat /app/.env.development | grep REDIS

# 查看应用日志
docker logs todolist-api-dev | grep -i "redis\|cache"

# 手动测试 Redis
docker exec todolist-redis-dev redis-cli
127.0.0.1:6379> keys *
127.0.0.1:6379> get user:1:profile
```

### 测试失败

```bash
# 清理测试环境
pnpm test --clearCache

# 重新安装依赖
pnpm install --force

# 清理 Docker
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up -d --build
```

## 监控和日志

### 实时监控

```bash
# 监控 Redis 命令
docker exec todolist-redis-dev redis-cli monitor

# 监控 Redis 统计
watch -n 1 'docker exec todolist-redis-dev redis-cli info stats'

# 监控应用日志
docker logs -f todolist-api-dev | grep "Cache"
```

### 性能指标

```bash
# Redis 内存使用
docker exec todolist-redis-dev redis-cli info memory

# Redis 连接数
docker exec todolist-redis-dev redis-cli info clients

# Redis 持久化状态
docker exec todolist-redis-dev redis-cli info persistence

# 应用缓存统计
docker logs todolist-api-dev | grep "Cache" | grep -o "HIT\|MISS" | sort | uniq -c
```

## 清理和重置

```bash
# 停止所有服务
docker compose -f docker-compose.dev.yml down

# 清理所有数据（包括 Redis 数据）
docker compose -f docker-compose.dev.yml down -v

# 清理 Redis 缓存
docker exec todolist-redis-dev redis-cli FLUSHALL

# 清理特定模式的键
docker exec todolist-redis-dev redis-cli --scan --pattern "user:*"
```

## 生产环境部署

### 部署前检查

- [ ] 修改 Redis 密码为强密码
- [ ] 调整 TTL 为生产环境合适的值
- [ ] 启用 Redis AOF 持久化
- [ ] 配置 Redis 健康检查
- [ ] 设置合理的内存限制
- [ ] 配置监控和告警

### 部署步骤

```bash
# 使用生产配置启动
docker compose up -d

# 验证所有服务健康状态
docker ps

# 检查日志
docker logs todolist-api-dev
docker logs todolist-redis-dev

# 运行生产环境测试
pnpm test:e2e
```

## 总结

完成以上测试步骤后，你应该能够：

1. ✅ 成功启动和配置 Redis 服务
2. ✅ 验证 Redis 与应用的集成
3. ✅ 测试所有缓存功能
4. ✅ 验证性能提升
5. ✅ 排查和解决常见问题
6. ✅ 准备生产环境部署

如遇到问题，请参考 [Redis集成文档.md](file:///Users/feynman/Documents/code/2026/CodeLearningPathWay/WebProject/ToDoList/docs/Redis集成文档.md) 获取详细的技术文档。
