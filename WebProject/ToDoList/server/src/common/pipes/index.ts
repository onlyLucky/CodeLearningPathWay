export * from './validation.pipe';
export * from './parse-int.pipe';

// 自定义管道作用：
// 1. 数据验证：确保请求数据符合预期格式和规则，防止无效数据进入应用。
// 2. 数据转换：将客户端发送的原始数据转换为应用内部使用的格式，如字符串转换为数字。
// 3. 数据 sanitization：清理和过滤输入数据，防止安全漏洞，如 SQL 注入。
