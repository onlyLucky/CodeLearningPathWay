import { SetMetadata } from '@nestjs/common';

/**
 * 元数据键：用于标记某个路由或处理器是否公开访问
 * 通过此键可在守卫中判断是否需要跳过认证校验
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * 装饰器：将控制器或路由标记为公开访问
 * 使用方式：在控制器类或路由方法上添加 @Public()
 * 添加后，对应接口将跳过全局认证守卫的校验
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// 使用示例：
/* @Controller('auth')
@Public()
export class AuthController {
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    // 登录逻辑，无需认证
  }
} */

/* 
  SetMetadata(key: string, value: any): ClassDecorator & MethodDecorator
  功能：为类或方法添加元数据
  参数：
    - key: 元数据键名，用于后续检索
    - value: 元数据值，可任意类型
  返回值：类装饰器 & 方法装饰器
  作用：在运行时为类或方法添加额外的信息，可用于依赖注入、守卫校验等场景 
*/
