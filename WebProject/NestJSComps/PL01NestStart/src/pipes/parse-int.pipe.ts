import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

/**
 * ParseIntPipe - 自定义整数解析管道
 * 将字符串参数转换为整数类型，转换失败时抛出异常
 */
@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  /**
   * 将字符串转换为整数
   * @param value - 待转换的字符串
   * @returns 转换后的整数
   * @throws BadRequestException 当字符串无法转换为整数时抛出异常
   */
  transform(value: string): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(
        'Validation failed (numeric string is expected)',
      );
    }
    return val;
  }
}
