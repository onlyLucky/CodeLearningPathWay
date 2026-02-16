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
