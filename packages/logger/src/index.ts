import type { LoggerOptions } from 'pino';

export function createLoggerOptions(serviceName: string): LoggerOptions {
  const options: LoggerOptions = {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    base: {
      service: serviceName,
    },
  };

  if (process.env.NODE_ENV !== 'production') {
    options.transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    };
  }

  return options;
}