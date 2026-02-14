import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// 引入 Reflector 服务，用于从元数据中获取角色信息
import { Reflector } from '@nestjs/core';

/**
 * 角色守卫：基于用户角色控制路由访问权限
 */
@Injectable()
export class RolesGuard implements CanActivate {
  // 构造函数注入 Reflector 服务，用于从元数据中获取角色信息
  constructor(private reflector: Reflector) {}

  /**
   * 判断当前请求是否具备访问权限
   * @param context 执行上下文，包含请求、响应等信息
   * @returns true：允许访问；false：拒绝访问
   */
  canActivate(context: ExecutionContext): boolean {
    // 从控制器类或处理器方法上获取所需的角色数组
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(), // 先查方法级别
      context.getClass(), // 再查类级别
    ]);

    // 如果没有配置角色要求，默认放行
    if (!requiredRoles) {
      return true;
    }

    // 从请求对象中解构出已认证的用户信息
    const { user } = context.switchToHttp().getRequest();

    // 只要用户拥有的角色中满足任意一个所需角色，即放行
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
