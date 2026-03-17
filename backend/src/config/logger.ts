import { createLogger, format, transports } from 'winston';
import { TransformableInfo } from 'logform';
import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';

interface LogInfo extends TransformableInfo {
  timestamp?: string;
  stack?: string;
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack }: LogInfo) => {
      return stack
        ? `${timestamp} [${level}]: ${message} - ${stack}`
        : `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join('logs', 'error.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '7d',
      auditFile: path.join('logs', 'audit.json'),
      zippedArchive: true,
    }),
    new transports.Console(),
  ],
});

export default logger;