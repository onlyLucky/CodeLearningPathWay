import { PipeTransform, Injectable } from '@nestjs/common';

/**
 * TrimPipe - 去除空格管道
 * 去除字符串首尾的空格
 */
@Injectable()
export class TrimPipe implements PipeTransform<string, string> {
  /**
   * 去除字符串首尾的空格
   * @param value - 待处理的字符串
   * @returns 去除首尾空格后的字符串
   */
  transform(value: string): string {
    if (typeof value !== 'string') {
      return value;
    }
    return value.trim();
  }
}
