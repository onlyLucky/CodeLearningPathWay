/**
 * 生成指定长度的随机字符串
 * @param length - 目标字符串长度，默认 32
 * @returns 由大小写字母和数字组成的随机字符串
 */
export const generateRandomString = (length: number = 32): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * 将文本转换为 URL 友好的 slug
 * @param text - 原始文本
 * @returns 小写、去掉多余空格、用连字符连接、移除非单词字符的字符串
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // 空格替换为连字符
    .replace(/[^\w-]+/g, '') // 移除非单词字符
    .replace(/--+/g, '-'); // 合并多个连字符
};

/**
 * 截断文本到指定长度并添加后缀
 * @param text - 原始文本
 * @param length - 最大长度
 * @param suffix - 截断后追加的后缀，默认 "..."
 * @returns 截断后的字符串
 */
export const truncate = (
  text: string,
  length: number,
  suffix: string = '...',
): string => {
  if (text.length <= length) {
    return text;
  }
  return text.substring(0, length) + suffix;
};

/**
 * 将文本首字母大写，其余小写
 * @param text - 原始文本
 * @returns 首字母大写、其余小写的字符串
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * 将文本转换为驼峰命名（camelCase）
 * @param text - 原始文本
 * @returns 驼峰命名的字符串，首单词小写，后续单词首字母大写，无空格
 */
export const camelize = (text: string): string => {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

/**
 * 转义 HTML 特殊字符，防止 XSS
 * @param text - 原始文本
 * @returns 转义后的字符串，& < > " ' 会被替换为对应实体
 */
export const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m] || m);
};
