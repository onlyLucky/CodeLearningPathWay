import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Response - 响应数据接口
 * 定义统一的响应数据格式，所有响应都会包装在这个结构中
 *
 * @template T - 响应数据的类型
 * @property data - 实际的响应数据
 */
export interface Response<T> {
  data: T;
}

/**
 * TransformInterceptor - 转换拦截器
 *
 * 该拦截器演示了如何使用 RxJS 的 map 操作符来转换响应数据
 * 它将所有响应数据包装在统一的 { data: ... } 格式中
 *
 * 使用场景：
 * - 统一 API 响应格式
 * - 添加元数据（如时间戳、版本号等）
 * - 过滤敏感数据
 * - 数据格式转换
 *
 * 泛型参数说明：
 * - 第一个 T: 输入数据的类型（路由处理程序返回的数据类型）
 * - 第二个 Response<T>: 输出数据的类型（转换后的响应类型）
 *
 * 使用方式：
 * 1. 方法级别：@UseInterceptors(TransformInterceptor)
 * 2. 控制器级别：在控制器类上使用 @UseInterceptors(TransformInterceptor)
 * 3. 全局级别：在 main.ts 或 app.module.ts 中注册为全局拦截器
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  /**
   * 拦截方法
   *
   * @param context - 执行上下文，包含请求和响应信息
   * @param next - 调用处理器，用于调用路由处理程序
   * @returns Observable<Response<T>> - 返回转换后的响应
   *
   * 执行流程：
   * 1. 调用 next.handle() 执行路由处理程序
   * 2. 使用 map 操作符转换响应数据
   * 3. 将原始数据包装在 { data: ... } 格式中
   *
   * map 操作符的作用：
   * - 接收原始响应数据
   * - 返回转换后的数据
   * - 会修改响应数据的内容
   *
   * 示例：
   * 原始响应: { name: 'Fluffy', age: 3 }
   * 转换后: { data: { name: 'Fluffy', age: 3 } }
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(map((data) => ({ data })));
  }
}
