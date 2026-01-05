import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { GlobalController } from './global/global.controller';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';

/**
 * AppModule - 应用程序根模块
 * 配置全局过滤器、守卫和中间件
 */
@Module({
  imports: [CatsModule],
  controllers: [GlobalController],
  providers: [
    /**
     * 全局异常过滤器
     * 使用 APP_FILTER token 将 HttpExceptionFilter 注册为全局过滤器
     * 这样所有控制器和路由都会使用这个异常过滤器
     */
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    /**
     * 全局认证守卫
     * 使用 APP_GUARD token 将 AuthGuard 注册为全局守卫
     * 这种方式设置的全局守卫可以使用依赖注入
     * RolesGuard 可以通过构造函数注入 Reflector 服务
     */
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    /**
     * 全局角色守卫
     * 使用 APP_GUARD token 将 RolesGuard 注册为全局守卫
     * RolesGuard 需要注入 Reflector 服务来获取装饰器设置的元数据
     * 只有使用 APP_GUARD token 才能正确注入依赖
     */
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    /**
     * 全局日志拦截器
     * 使用 APP_INTERCEPTOR token 将 LoggingInterceptor 注册为全局拦截器
     * 这种方式设置的全局拦截器可以使用依赖注入
     * 拦截器会记录所有请求和响应的日志
     */
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    /**
     * 全局转换拦截器
     * 使用 APP_INTERCEPTOR token 将 TransformInterceptor 注册为全局拦截器
     * 拦截器会统一包装所有响应数据的格式为 { data: ... }
     */
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  /**
   * 配置中间件
   * 将 LoggerMiddleware 应用于所有路由
   * @param consumer - 中间件消费者，用于配置中间件
   */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
