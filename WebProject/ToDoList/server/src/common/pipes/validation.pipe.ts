import {
  PipeTransform, // 管道转换接口，定义 transform 方法
  Injectable,
  ArgumentMetadata, // 包含参数元数据的接口，用于获取参数的类型信息
  BadRequestException, // 用于抛出 HTTP 400 错误的异常类
} from '@nestjs/common';
// 引入 class-validator 库，用于校验类实例
import { validate } from 'class-validator';
// 引入 class-transformer 库，用于将普通对象转换为类实例
import { plainToInstance } from 'class-transformer';

/**
 * 全局验证管道
 * 负责将传入的纯对象转换为类实例，并使用 class-validator 进行校验
 *
 * @example
 * // 在控制器路由处理程序中使用
 * @Post()
 * createTodo(@Body(new ValidationPipe()) createTodoDto: CreateTodoDto) {
 *   // 校验通过后，createTodoDto 为 CreateTodoDto 类的实例
 * }
 */
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  /**
   * 转换并校验传入的值
   * @param value 控制器路由处理程序接收到的参数 , 举例 : { title: 'Buy groceries', completed: false }
   * @param metadata 包含当前参数的元数据信息，举例 : { metatype: CreateTodoDto, type: 'body', data: 'createTodoDto' }
   * @returns 校验通过后的值
   * @throws BadRequestException 当校验失败时抛出
   *
   */
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const messages = errors.map((error) => {
        return Object.values(error.constraints || {}).join(', ');
      });
      throw new BadRequestException(messages.join('; '));
    }

    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
