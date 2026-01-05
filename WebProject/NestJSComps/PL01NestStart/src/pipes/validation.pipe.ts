import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

/**
 * ValidationPipe - 自定义验证管道，用于验证请求数据
 * 根据参数类型（body、param、query）进行相应的验证
 */
@Injectable()
export class ValidationPipe implements PipeTransform {
  /**
   * 转换并验证传入的值
   * @param value - 待验证的值
   * @param metadata - 包含类型信息的参数元数据
   * @returns 验证通过的值
   * @throws BadRequestException 验证失败时抛出异常
   */
  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    // 检查值是否存在
    if (!value) {
      throw new BadRequestException('Validation failed: no value provided');
    }

    // 根据参数类型进行验证
    if (metadata.type === 'body') {
      this.validateBody(value);
    } else if (metadata.type === 'param') {
      this.validateParam(value);
    } else if (metadata.type === 'query') {
      this.validateQuery(value);
    }

    return value;
  }

  /**
   * 验证请求体是否为对象
   * @param value - 待验证的请求体
   * @throws BadRequestException 如果不是对象类型
   */
  private validateBody(value: any) {
    if (typeof value !== 'object') {
      throw new BadRequestException(
        'Validation failed: body must be an object',
      );
    }
  }

  /**
   * 验证路由参数是否为字符串
   * @param value - 待验证的路由参数
   * @throws BadRequestException 如果不是字符串类型
   */
  private validateParam(value: any) {
    if (typeof value !== 'string') {
      throw new BadRequestException(
        'Validation failed: param must be a string',
      );
    }
  }

  /**
   * 验证查询参数是否为字符串
   * @param value - 待验证的查询参数
   * @throws BadRequestException 如果不是字符串类型
   */
  private validateQuery(value: any) {
    if (typeof value !== 'string') {
      throw new BadRequestException(
        'Validation failed: query must be a string',
      );
    }
  }
}
