

### server

#### 初始化项目
在服务器环境中执行以下详细操作：

1. 使用NestJS CLI初始化一个符合企业级标准的项目框架结构，确保包含核心模块、控制器、服务和拦截器等基础组件
2. 配置TypeScript作为项目主要开发语言，设置严格的类型检查规则，包括但不限于noImplicitAny、strictNullChecks等选项
3. 集成MySQL数据库，使用mysql2驱动和TypeORM作为ORM工具，配置数据库连接池、实体关系映射和迁移功能
4. 实现基于Docker的容器化部署方案，创建多阶段构建Dockerfile，编写docker-compose.yml文件以支持服务编排
5. 配置完善的多环境支持系统，为开发(development)、测试(test)和生产(production)环境分别创建独立的配置文件，实现环境变量注入和配置参数动态加载
6. 集成数据校验机制，使用class-validator进行请求数据验证；配置Swagger/OpenAPI生成接口文档；实现基于Winston的日志系统，支持日志分级(debug/info/warn/error)、按日期切割的日志持久化存储和日志轮转策略
7. 建立全面的代码测试体系，包括单元测试、集成测试和端到端测试，配置Jest作为测试框架，确保代码测试覆盖率达到预设标准（建议不低于80%）
8. 所有依赖库管理使用pnpm

项目目录结构优化
1. 优化项目结构，新增公共/src/common，用来存放公共过滤器、拦截器、守卫等
   /src/common/constants/ # 全局常量：枚举、常量值、静态变量、错误码等
   /src/common/decorators/ # 自定义装饰器：比如 @User()、@Auth()、@Roles()
   /src/common/filters/ # 全局异常过滤器：捕获并处理应用程序中抛出的异常
   /src/common/guards/ # 全局守卫：用于权限验证、角色检查等
   /src/common/interceptors/ # 全局拦截器：如日志记录、性能监控等
   /src/common/pipes/ # 全局管道：如数据转换、校验等
   /src/common/utils/ # 公共工具函数：如加密、解密、日期格式化等
   /src/common/validators/ # 自定义校验器：如手机号、邮箱等格式校验
   /src/common/exceptions/ # 全局异常过滤器、自定义业务异常类（统一异常处理）
   /src/common/middleware/ # 全局中间件：跨域、请求头处理、接口限流等
2. 新增/src/database存放数据库处理功能
3. 新增/src/modules存放业务模块，每个模块对应一个功能，如用户模块、任务模块等


文档完善
1. 重新初始化README.md文件，包括项目介绍、项目架构目录说明、安装依赖、运行项目、测试项目、部署项目等基本操作
2. 新增/docs/目录，用来存放项目相关文档，如API文档、数据库设计文档、部署文档等

修复
1. 去除app.service.ts、app.controller.ts、app.controller.spec.ts文件，没有实际业务逻辑文件，优化项目结构，同步修改文档内项目目录结构
2. 运行eslint检测，修复所有代码风格问题