import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

/**
 * 将字符串参数解析为整数的管道
 * 如果解析失败，则抛出 BadRequestException
 *
 * @param value - 需要转换的字符串
 * @returns 转换后的整数
 * @throws BadRequestException 当输入字符串无法解析为有效整数时
 *
 */
@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  /**
   * 将输入的字符串转换为整数
   * @param value - 需要转换的字符串
   * @returns 转换后的整数
   * @throws BadRequestException 当输入字符串无法解析为有效整数时
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
