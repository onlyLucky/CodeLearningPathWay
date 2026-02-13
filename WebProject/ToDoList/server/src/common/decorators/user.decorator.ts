import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 自定义装饰器：用于从请求中提取用户信息
 * 可作用于控制器方法的参数上，自动注入当前登录用户对象或用户对象的某个字段
 *
 * @param data 可选，若传入则返回 user[data]，否则返回整个 user 对象
 * @param ctx  执行上下文，NestJS 自动传入
 * @returns    整个用户对象或用户对象的指定字段值
 *
 * 示例：
 * 1. 获取完整用户对象
 *    @Get('profile')
 *    getProfile(@User() user: UserEntity) { ... }
 *
 * 2. 仅获取用户 ID
 *    @Get('id')
 *    getUserId(@User('id') userId: string) { ... }
 */
export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    // 从 HTTP 请求对象中取出 user（通常由 AuthGuard 挂载）
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // 若调用时指定了字段名，则返回对应字段值；否则返回整个用户对象
    return data ? user?.[data] : user;
  },
);
