import { PipeTransform, Injectable } from '@nestjs/common';

/**
 * ToLowerCasePipe - 转小写管道
 * 将字符串参数转换为小写形式
 */
@Injectable()
export class ToLowerCasePipe implements PipeTransform<string, string> {
  /**
   * 将字符串转换为小写
   * @param value - 待转换的字符串
   * @returns 转换为小写的字符串
   */
  transform(value: string): string {
    if (typeof value !== 'string') {
      return value;
    }
    return value.toLowerCase();
  }
}
