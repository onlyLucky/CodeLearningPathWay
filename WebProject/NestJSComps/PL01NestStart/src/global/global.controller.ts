import { Controller, Get } from '@nestjs/common';

/**
 * GlobalController - 全局控制器
 * 用于演示全局守卫的使用
 * 该控制器的所有路由都会受到 app.module.ts 中设置的全局守卫保护
 *
 * 全局守卫通过 APP_GUARD provider 设置，可以：
 * 1. 使用依赖注入（如 Reflector）
 * 2. 应用于所有控制器和路由
 * 3. 在 app.module.ts 中统一配置
 */
@Controller('global')
export class GlobalController {
  /**
   * 获取全局路由
   * 该路由受到全局 AuthGuard 和 RolesGuard 的保护
   * 由于没有设置 @Roles() 装饰器，RolesGuard 会允许访问
   * 但仍然需要通过 AuthGuard 的认证
   *
   * @returns 受全局守卫保护的路由响应
   */
  @Get()
  getGlobal() {
    return 'This route is protected by global guards';
  }

  /**
   * 获取管理员路由
   * 该路由受到全局守卫的保护
   * 可以通过添加 @Roles() 装饰器来进一步限制访问
   *
   * @returns 受全局守卫保护的管理员路由响应
   */
  @Get('admin')
  getAdmin() {
    return 'This admin route is protected by global guards';
  }
}
