import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ValidationPipe } from './pipes/validation.pipe';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';

/**
 * 应用程序启动函数
 * 创建并配置 NestJS 应用实例
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * 全局异常过滤器
   * 使用 HttpExceptionFilter 捕获所有 HTTP 异常
   * 全局过滤器会应用于所有控制器和路由
   */
  app.useGlobalFilters(new HttpExceptionFilter());

  /**
   * 全局验证管道
   * 使用 ValidationPipe 对所有传入的请求数据进行验证
   * 全局管道会应用于所有控制器方法
   */
  app.useGlobalPipes(new ValidationPipe());

  /**
   * 全局拦截器（方法1：在 main.ts 中设置）
   * 使用 useGlobalInterceptors() 方法设置全局拦截器
   * 注意：这种方式设置的拦截器无法使用依赖注入
   * 如果需要依赖注入，应该在 app.module.ts 中使用 APP_INTERCEPTOR token
   *
   * LoggingInterceptor: 记录所有请求和响应的日志
   * TransformInterceptor: 统一包装所有响应数据的格式
   */
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());

  /**
   * 全局守卫（方法1：在 main.ts 中设置）
   * 使用 useGlobalGuards() 方法设置全局守卫
   * 注意：这种方式设置的守卫无法使用依赖注入
   * 如果需要依赖注入，应该在 app.module.ts 中使用 APP_GUARD token
   *
   * 示例代码（已注释，因为我们在 app.module.ts 中使用了更好的方式）：
   * app.useGlobalGuards(new AuthGuard());
   * app.useGlobalGuards(new RolesGuard());
   *
   * 在 app.module.ts 中，我们使用 APP_GUARD provider 来设置全局守卫
   * 这样守卫可以使用依赖注入，并且可以访问 Reflector 等服务
   */

  /**
   * 启动 HTTP 服务器
   * 监听环境变量 PORT 指定的端口，默认为 3000
   */
  await app.listen(process.env.PORT ?? 3000);
}

/**
 * 启动应用程序
 * void 关键字表示我们不等待 Promise 完成
 * 这样可以避免 TypeScript 的 floating promise 警告
 */
void bootstrap();
