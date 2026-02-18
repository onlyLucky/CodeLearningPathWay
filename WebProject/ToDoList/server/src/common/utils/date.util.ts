/**
 * 将日期或日期字符串格式化为 ISO 字符串
 * @param date - 日期对象或可解析的日期字符串
 * @returns ISO 格式的日期字符串（例如：2023-01-01T00:00:00.000Z）
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toISOString();
};

/**
 * 在给定日期上增加指定天数
 * @param date - 基准日期
 * @param days - 要增加的天数（可为负数）
 * @returns 增加天数后的新日期对象
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * 在给定日期上增加指定小时数
 * @param date - 基准日期
 * @param hours - 要增加的小时数（可为负数）
 * @returns 增加小时数后的新日期对象
 */
export const addHours = (date: Date, hours: number): Date => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

/**
 * 判断给定日期或日期字符串是否有效
 * @param date - 日期对象或可解析的日期字符串
 * @returns 有效返回 true，无效返回 false
 */
export const isDateValid = (date: Date | string): boolean => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

/**
 * 获取指定日期当天的起始时间（00:00:00.000）
 * @param date - 基准日期
 * @returns 当天起始时间的新日期对象
 */
export const getStartOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * 获取指定日期当天的结束时间（23:59:59.999）
 * @param date - 基准日期
 * @returns 当天结束时间的新日期对象
 */
export const getEndOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * 将日期字符串格式化为 Date 对象
 * @param dateString - 日期字符串（支持多种格式，如：2023-01-01、2023/01/01、2023-01-01T00:00:00.000Z 等）
 * @returns Date 对象，如果解析失败返回当前时间
 */
export const parseDateString = (dateString: string): Date => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return new Date();
  }
  return date;
};

/**
 * 格式化日期为指定格式
 * @param date - 日期对象或可解析的日期字符串
 * @param format - 输出格式字符串，支持占位符：YYYY(年)、MM(月)、DD(日)、hh(时)、mm(分)、ss(秒)
 * @returns 格式化后的字符串
 *
 * @example
 * // 输入：new Date('2023-01-01T12:30:45.000Z') 格式：YYYY-MM-DD hh:mm:ss
 * // 输出："2023-01-01 12:30:45"
 *
 */
export const formatDateTime = (
  date: Date | string,
  format: string = 'YYYY-MM-DD hh:mm:ss',
): string => {
  const d = typeof date === 'string' ? parseDateString(date) : date;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('hh', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};
