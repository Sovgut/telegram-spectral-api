import chalk from "chalk";

enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

interface LoggerContext {
  scope: string;

  [key: string]: any;
}

const Levels: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
};

export class Logger {
  private readonly transport = console.log;
  private readonly isPrettyfied = process.env.NODE_ENV === "local";

  private commit(context: LoggerContext, defaultLevel: LogLevel): void {
    const processLevel = process.env.LOG_LEVEL as LogLevel | undefined;
    const level = processLevel ?? defaultLevel;

    context.timestamp = new Date().toISOString();
    context.level = defaultLevel;

    if (Levels[level] <= Levels[defaultLevel]) {
      if (this.isPrettyfied) {
        this.transport(`[${chalk.blue(context.scope)}]: ${JSON.stringify(context, null, 2)}`);
      } else {
        this.transport(JSON.stringify(context));
      }
    }
  }

  public async log(context: LoggerContext): Promise<void> {
    this.commit(context, LogLevel.DEBUG);
  }

  public async info(context: LoggerContext): Promise<void> {
    this.commit(context, LogLevel.INFO);
  }

  public async warn(context: LoggerContext): Promise<void> {
    this.commit(context, LogLevel.WARN);
  }

  public async error(context: LoggerContext): Promise<void> {
    this.commit(context, LogLevel.ERROR);
  }
}
