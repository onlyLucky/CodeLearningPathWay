# ToDoList Server

基于 NestJS 构建的企业级待办事项管理后端服务。

## 项目简介

本项目是一个功能完善的待办事项管理系统后端服务，采用 NestJS 框架构建，提供用户管理、待办事项管理等核心功能。项目遵循企业级开发标准，包含完整的认证授权、数据验证、日志记录、API 文档等功能。

## 技术栈

- **框架**: NestJS
- **语言**: TypeScript
- **数据库**: MySQL
- **ORM**: TypeORM
- **认证**: JWT
- **文档**: Swagger/OpenAPI
- **日志**: Winston
- **验证**: class-validator
- **容器化**: Docker & Docker Compose
- **包管理**: pnpm

## 项目架构

```
server/
├── src/
│   ├── common/                 # 公共模块
│   │   ├── constants/          # 常量定义
│   │   ├── decorators/         # 装饰器
│   │   ├── filters/            # 异常过滤器
│   │   ├── guards/             # 守卫
│   │   ├── interceptors/       # 拦截器
│   │   ├── interfaces/         # 接口定义
│   │   ├── pipes/              # 管道
│   │   └── utils/              # 工具函数
│   ├── config/                 # 配置文件
│   │   ├── validation.config.ts
│   │   └── winston.config.ts
│   ├── database/               # 数据库相关
│   │   ├── repositories/       # 仓储层
│   │   ├── seeds/              # 数据种子
│   │   └── database.module.ts
│   ├── entities/               # 实体定义
│   │   ├── user.entity.ts
│   │   └── todo.entity.ts
│   ├── modules/                # 业务模块
│   │   ├── users/              # 用户模块
│   │   │   ├── dto/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   └── todos/              # 待办事项模块
│   │       ├── dto/
│   │       ├── todos.controller.ts
│   │       ├── todos.service.ts
│   │       └── todos.module.ts
│   ├── types/                  # 类型定义
│   ├── app.module.ts           # 应用模块
│   └── main.ts                 # 应用入口
├── test/                       # 测试文件
│   └── app.e2e-spec.ts
├── .env.development            # 开发环境配置
├── .env.test                   # 测试环境配置
├── .env.production             # 生产环境配置
├── .env.example                # 环境变量示例
├── Dockerfile                  # Docker 镜像构建文件
├── docker-compose.yml          # 生产环境编排
├── docker-compose.dev.yml      # 开发环境编排
├── nest-cli.json               # NestJS CLI 配置
├── tsconfig.json               # TypeScript 配置
└── package.json                # 项目依赖
```

## 功能特性

### 用户管理
- 用户注册与登录
- 用户信息查询与更新
- 基于角色的访问控制（RBAC）
- 密码加密存储

### 待办事项管理
- 创建、查询、更新、删除待办事项
- 待办事项状态管理（pending、in_progress、completed）
- 优先级设置（low、medium、high）
- 到期日期管理
- 统计信息查询

### 系统功能
- JWT 身份认证
- 全局异常处理
- 请求/响应日志记录
- 数据验证
- API 文档自动生成
- 请求超时控制
- 速率限制

## 安装依赖

确保已安装 Node.js（推荐 v18+）和 pnpm。

```bash
# 安装 pnpm（如果尚未安装）
npm install -g pnpm

# 安装项目依赖
pnpm install
```

## 环境配置

复制环境变量示例文件并根据实际情况修改：

```bash
cp .env.example .env.development
```

配置项说明：

```env
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=todolist
DB_SYNCHRONIZE=true
DB_LOGGING=true
DB_POOL_SIZE=10
DB_MAX_QUERY_TIME=1000

# JWT 配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

## 运行项目

### 开发模式

```bash
# 启动开发服务器（热重载）
pnpm run start:dev
```

### 生产模式

```bash
# 构建项目
pnpm run build

# 启动生产服务器
pnpm run start:prod
```

### 调试模式

```bash
# 启动调试服务器
pnpm run start:debug
```

## API 文档

启动项目后，访问以下地址查看 Swagger API 文档：

```
http://localhost:3000/api
```

## 测试项目

### 单元测试

```bash
# 运行所有单元测试
pnpm run test

# 监听模式运行测试
pnpm run test:watch

# 测试覆盖率
pnpm run test:cov
```

### 端到端测试

```bash
# 运行 E2E 测试
pnpm run test:e2e
```

### 测试配置

测试覆盖率要求：
- 语句覆盖率：≥ 80%
- 分支覆盖率：≥ 80%
- 函数覆盖率：≥ 80%
- 行覆盖率：≥ 80%

## Docker 部署

### 开发环境

```bash
# 使用 Docker Compose 启动开发环境
docker-compose -f docker-compose.dev.yml up -d

# 查看日志
docker-compose -f docker-compose.dev.yml logs -f

# 停止服务
docker-compose -f docker-compose.dev.yml down
```

### 生产环境

```bash
# 使用 Docker Compose 启动生产环境
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 构建镜像

```bash
# 构建 Docker 镜像
docker build -t todolist-server:latest .

# 运行容器
docker run -p 3000:3000 \
  -e DB_HOST=host.docker.internal \
  -e DB_USERNAME=root \
  -e DB_PASSWORD=your_password \
  todolist-server:latest
```

## 数据库迁移

```bash
# 生成迁移文件
pnpm typeorm migration:generate -n MigrationName

# 运行迁移
pnpm typeorm migration:run

# 回滚迁移
pnpm typeorm migration:revert
```

## 代码规范

### Lint 检查

```bash
# 运行 ESLint 检查
pnpm run lint

# 自动修复
pnpm run lint -- --fix
```

### 格式化代码

```bash
# 运行 Prettier 格式化
pnpm run format
```

## 项目脚本

```bash
# 启动开发服务器
pnpm run start:dev

# 构建项目
pnpm run build

# 运行生产服务器
pnpm run start:prod

# 运行测试
pnpm run test

# 运行 E2E 测试
pnpm run test:e2e

# 测试覆盖率
pnpm run test:cov

# Lint 检查
pnpm run lint

# 格式化代码
pnpm run format
```

## 常见问题

### 数据库连接失败

检查数据库配置是否正确，确保 MySQL 服务已启动。

### JWT 认证失败

检查 JWT_SECRET 配置是否正确，确保 token 未过期。

### 端口被占用

修改 .env 文件中的 PORT 配置或停止占用端口的进程。

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证。

## 联系方式

如有问题或建议，请提交 Issue 或 Pull Request。
