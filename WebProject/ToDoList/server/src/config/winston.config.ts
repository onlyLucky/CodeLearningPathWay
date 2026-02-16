import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// 日志文件存放目录
const logDir = 'logs';

/**
 * Winston 日志配置
 * 提供控制台输出与按日期分割的文件日志，支持自动压缩与清理
 */
export const winstonConfig = WinstonModule.createLogger({
  transports: [
    // 控制台输出：带时间戳、彩色等级、上下文与堆栈信息
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(
          ({ timestamp, level, message, context, trace }) => {
            const contextStr =
              typeof context === 'string' ? context : 'Application';
            const traceStr = trace ? `\n${String(trace)}` : '';
            return `${String(timestamp)} [${contextStr}] ${level}: ${String(message)}${traceStr}`;
          },
        ),
      ),
    }),
    // 应用日志文件：按天分割，自动压缩，保留 14 天或达到 20 MB 后滚动
    new DailyRotateFile({
      dirname: logDir,
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: process.env.LOG_MAX_SIZE || '20m',
      maxFiles: process.env.LOG_MAX_FILES || '14d',
      level: process.env.LOG_LEVEL || 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    // 错误日志文件：仅记录 error 级别，保留 30 天
    new DailyRotateFile({
      dirname: logDir,
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: process.env.LOG_MAX_SIZE || '20m',
      maxFiles: process.env.LOG_MAX_FILES || '30d',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});
