import { SetMetadata } from '@nestjs/common';

/**
 * 用于在装饰器中存储角色信息的元数据键
 */
export const ROLES_KEY = 'roles';

/**
 * 角色装饰器：用于在控制器或路由处理器上声明所需的角色权限
 * @param roles 允许访问的角色列表，可变参数
 * @returns 返回 SetMetadata 装饰器，将角色信息附加到路由元数据
 * @example
 * @Roles('admin', 'manager')
 * updateResource() { ... }
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
