import { SetMetadata } from '@nestjs/common';

/**
 * 角色元数据的键名
 * 用于在 Reflector 中查找角色信息
 */
export const ROLES_KEY = 'roles';

/**
 * Roles - 自定义角色装饰器
 * 用于标记路由处理程序或控制器类所需的角色
 *
 * 使用示例：
 * @Roles('admin') - 只有 admin 角色可以访问
 * @Roles('admin', 'user') - admin 或 user 角色都可以访问
 *
 * @param roles - 允许访问的角色列表
 * @returns 装饰器函数，将角色信息设置为元数据
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
