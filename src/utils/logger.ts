import { createLogger, format, Logger, transports } from 'winston';

const { combine, timestamp, prettyPrint, json } = format;

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

class CustomLogger {
  private logger: Logger;
  constructor() {
    this.logger = createLogger({
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        prettyPrint(),
        json()
      ),
      levels: LOG_LEVELS,
      transports: [new transports.Console({})],
    });
  }

  info(message: string, obj: object | null = null): Logger {
    return this.logger.info(message, obj);
  }

  debug(message: string, obj: object | null = null): Logger {
    return this.logger.debug(message, obj);
  }

  warn(message: string, obj: object | null = null): Logger {
    return this.logger.warn(message, obj);
  }

  error(message: string, obj: object | null = null): Logger {
    return this.logger.error(message, obj);
  }
}

export default new CustomLogger();
