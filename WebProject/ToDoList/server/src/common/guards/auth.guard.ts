import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * 身份验证守卫
 * 用于验证请求头中的 Bearer Token，确保用户已登录
 *
 * 使用方式：
 * 1. 全局注册：在主模块（如 app.module.ts）中使用 `app.useGlobalGuards(new AuthGuard(jwtService));`
 * 2. 局部注册：在具体控制器或路由处理器上使用 `@UseGuards(AuthGuard)` 装饰器
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  /**
   * 守卫主方法
   * 提取并验证 JWT，若合法则将用户信息挂载到请求对象
   * @param context 执行上下文
   * @returns 验证通过返回 true
   * @throws UnauthorizedException 当 Token 缺失或无效时抛出
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
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

  /**
   * 从 Authorization 请求头中提取 Bearer Token
   * @param request Express 请求对象
   * @returns 提取到的 Token，若格式不正确则返回 undefined
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    // 拆分 Authorization 头，格式应为 "Bearer <token>"
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
