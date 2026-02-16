# VSCode NestJS 后端接口断点调试指南

## 概述

本指南详细介绍如何在 VSCode 中对 NestJS 后端接口进行断点调试，包括控制器、服务、守卫、拦截器等各个层面的调试技巧。

## 前置条件

- VSCode 已安装
- Node.js 和 pnpm 已安装
- NestJS 项目已配置好调试配置

## 调试配置

### launch.json 配置

项目已配置好 `.vscode/launch.json`，包含以下调试配置：

1. **Debug NestJS** - 调试 NestJS 应用
2. **Debug Jest Tests** - 调试 Jest 测试
3. **Debug Jest Current File** - 调试当前测试文件
4. **Attach to NestJS** - 附加到正在运行的 NestJS 进程

### package.json 脚本

确保 `package.json` 包含以下脚本：

```json
{
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:debug": "jest --watch --no-coverage"
  }
}
```

## 基础调试步骤

### 1. 启动调试模式

**方法一：使用 VSCode 调试器（推荐）**

1. 打开 VSCode
2. 按 `F5` 或点击左侧调试图标（虫子图标）
3. 选择 "Debug NestJS" 配置
4. 等待应用启动

**方法二：使用命令行启动调试**

```bash
# 在终端中运行
pnpm run start:debug
```

然后在 VSCode 中使用 "Attach to NestJS" 配置附加到进程。

### 2. 设置断点

在代码中设置断点的方式：

- **点击行号左侧**：在想要暂停的代码行左侧点击，出现红点
- **快捷键**：`F9` - 在当前行设置/取消断点
- **条件断点**：右键点击行号左侧，选择 "Add Conditional Breakpoint"

### 3. 发送请求触发断点

使用以下任一方式发送请求：

- **Postman/Insomnia**：发送 HTTP 请求
- **curl**：命令行发送请求
- **浏览器**：直接访问 API 地址
- **Swagger UI**：访问 `http://localhost:3000/api/docs`

### 4. 调试操作

当断点触发后，可以使用以下操作：

- **继续执行**：`F5` 或点击绿色播放按钮
- **单步跳过**：`F10` - 执行当前行，不进入函数
- **单步进入**：`F11` - 进入当前行调用的函数
- **单步跳出**：`Shift+F11` - 跳出当前函数
- **查看变量**：在左侧变量面板查看当前作用域的变量
- **查看调用栈**：在左侧调用栈面板查看函数调用链
- **监视表达式**：添加要监视的表达式，实时查看其值

## 各层级调试技巧

### 1. 控制器层调试

调试控制器中的路由处理方法：

```typescript
@Controller('todos')
export class TodosController {
  @Get()
  findAll(@Request() req: RequestWithUser, @Query('status') status?: string) {
    // 在这里设置断点，查看请求参数
    const userId = req.user.id;
    return this.todosService.findAll(userId, status);
  }
}
```

**调试要点：**
- 检查 `req.user` 是否正确解析
- 检查查询参数 `status` 的值
- 检查传递给服务层的参数

### 2. 服务层调试

调试服务中的业务逻辑：

```typescript
@Injectable()
export class TodosService {
  async findAll(userId: number, status?: string): Promise<Todo[]> {
    // 在这里设置断点，查看查询逻辑
    const cacheKey = this.redisService.generateUserKey(userId, 'todos', status ? `status=${status}` : '');
    const cachedTodos = await this.redisService.get<Todo[]>(cacheKey);
    
    if (cachedTodos) {
      return cachedTodos;
    }

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const todos = await this.todoRepository.find({ where });
    await this.redisService.set(cacheKey, todos);
    return todos;
  }
}
```

**调试要点：**
- 检查缓存键生成是否正确
- 检查缓存命中情况
- 检查数据库查询条件
- 检查返回的数据格式

### 3. 守卫层调试

调试守卫中的权限验证：

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 在这里设置断点，查看验证流程
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
```

**调试要点：**
- 检查 `@Public()` 装饰器是否被正确识别
- 检查 token 提取逻辑
- 检查 JWT 验证结果
- 检查用户信息是否正确挂载到 request

### 4. 拦截器层调试

调试拦截器中的请求/响应处理：

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 在这里设置断点，查看请求信息
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        // 在这里设置断点，查看响应信息
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const delay = Date.now() - now;

        this.logger.log(
          `${method} ${url} ${statusCode} - ${userAgent} ${ip} +${delay}ms`,
        );
      }),
    );
  }
}
```

**调试要点：**
- 检查请求信息提取
- 检查响应状态码
- 检查执行时间计算

### 5. 管道层调试

调试管道中的数据验证：

```typescript
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    // 在这里设置断点，查看验证逻辑
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const messages = errors.map((error) => {
        return Object.values(error.constraints || {}).join(', ');
      });
      throw new BadRequestException(messages.join('; '));
    }

    return value;
  }
}
```

**调试要点：**
- 检查 `metatype` 是否正确
- 检查对象转换结果
- 检查验证错误信息

## 高级调试技巧

### 1. 条件断点

只在特定条件下触发断点：

```typescript
// 在断点上右键，添加条件
// 例如：只在 userId 为 1 时触发
if (userId === 1) {
  // 断点只会在 userId === 1 时触发
}
```

### 2. 日志点

不暂停执行，只输出日志：

```typescript
// 在断点上右键，选择 "Add Logpoint"
// 输入要记录的表达式
`User ID: ${userId}, Status: ${status}`
```

### 3. 异常断点

在抛出异常时自动暂停：

1. 打开调试视图
2. 点击 "Breakpoints" 面板上的齿轮图标
3. 勾选 "Uncaught Exceptions" 或 "Caught Exceptions"

### 4. 监视表达式

添加要持续监视的表达式：

1. 在调试时，点击 "Watch" 面板
2. 点击 "+" 添加表达式
3. 输入要监视的变量或表达式

例如：
- `req.user.id`
- `todos.length`
- `cacheKey`

### 5. 调试控制台

在调试控制台中执行代码：

```javascript
// 查看当前变量
req.user

// 修改变量值
userId = 2

// 调用函数
this.redisService.get('test-key')
```

## 常见调试场景

### 场景 1：调试登录流程

1. 在 `AuthController.login` 方法设置断点
2. 在 `UsersService.validateUser` 方法设置断点
3. 在 `AuthService.login` 方法设置断点
4. 在 `AuthGuard.canActivate` 方法设置断点
5. 发送登录请求
6. 逐步执行，查看整个流程

### 场景 2：调试缓存逻辑

1. 在 `RedisService.get` 方法设置断点
2. 在 `TodosService.findAll` 方法设置断点
3. 发送获取 Todo 列表请求
4. 查看缓存命中情况
5. 第二次发送相同请求，查看缓存是否生效

### 场景 3：调试权限验证

1. 在 `AuthGuard.canActivate` 方法设置断点
2. 在 `RolesGuard.canActivate` 方法设置断点
3. 发送需要权限的请求（不带 token）
4. 查看守卫如何拒绝请求
5. 发送带 token 的请求，查看守卫如何通过

### 场景 4：调试数据库查询

1. 在 `UsersService.findOne` 方法设置断点
2. 在查询语句前设置断点
3. 发送获取用户请求
4. 查看查询条件
5. 查看查询结果

## 性能分析

### 1. 使用性能分析

```bash
# 启动性能分析
node --prof dist/main.js

# 生成性能报告
node --prof-process isolate-*.log > processed.txt

# 使用 Chrome DevTools 查看报告
```

### 2. 使用 VSCode 性能分析

1. 在调试时，点击 "Performance" 标签
2. 点击 "Start Profiling"
3. 执行一些操作
4. 点击 "Stop Profiling"
5. 分析性能数据

## 故障排查

### 问题 1：断点不触发

**可能原因：**
- 代码未编译到最新版本
- 断点设置在注释行
- 断点设置在不会执行的代码路径

**解决方法：**
```bash
# 重新编译
pnpm run build

# 清理缓存后重新编译
rm -rf dist && pnpm run build
```

### 问题 2：无法连接到调试器

**可能原因：**
- 端口被占用
- 防火墙阻止连接

**解决方法：**
```bash
# 检查端口占用
lsof -i :9229

# 更改调试端口
# 在 launch.json 中修改 "port" 配置
```

### 问题 3：调试速度慢

**可能原因：**
- 监视表达式过多
- 断点过多

**解决方法：**
- 减少不必要的监视表达式
- 禁用不需要的断点

## 最佳实践

1. **使用有意义的断点名称**：在断点上右键，选择 "Edit Breakpoint"，添加描述
2. **及时清理断点**：调试完成后，禁用或删除不需要的断点
3. **使用条件断点**：避免在循环中频繁暂停
4. **记录调试笔记**：记录发现的问题和解决方案
5. **使用调试控制台**：在控制台中快速测试代码片段
6. **检查变量类型**：确保变量类型符合预期
7. **查看调用栈**：了解函数调用链，快速定位问题

## 快捷键参考

| 快捷键 | 功能 |
|---------|--------|
| `F5` | 继续执行 |
| `F9` | 设置/取消断点 |
| `F10` | 单步跳过 |
| `F11` | 单步进入 |
| `Shift+F11` | 单步跳出 |
| `Shift+F5` | 停止调试 |
| `Ctrl+Shift+F5` | 重新启动调试 |
| `Ctrl+G` | 跳转到行 |
| `Ctrl+Shift+F` | 在文件中查找 |

## 相关资源

- [VSCode 调试文档](https://code.visualstudio.com/docs/nodejs-debugging)
- [NestJS 调试指南](https://docs.nestjs.com/techniques/debugging)
- [TypeScript 调试](https://www.typescriptlang.org/docs/handbook/debugging.html)

## 总结

通过掌握以上调试技巧，你可以：

- ✅ 快速定位和修复 bug
- ✅ 理解代码执行流程
- ✅ 优化应用性能
- ✅ 提高开发效率

记住，调试是开发过程中的重要技能，多练习才能熟练掌握！
