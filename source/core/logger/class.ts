import { pino } from "pino";
import { DEV_TRANSPORT_OPTIONS, LEVELS_GUARD, LogLevel } from "./constants.js";
import { type LoggerContext } from "./types.js";

const LOG_LEVEL = (process.env.LOG_LEVEL as LogLevel)?.toLowerCase() as LogLevel;
const transport = pino({
	level: LEVELS_GUARD[LOG_LEVEL] ?? LogLevel.DEBUG,
	transport: process.env.NODE_ENV === "production" ? undefined : DEV_TRANSPORT_OPTIONS,
});

export class Logger {
	constructor(readonly parentScope: string) {}

	private commit(context: LoggerContext, level: LogLevel): void {
		context.timestamp = new Date().toISOString();
		context.scope = `${this.parentScope}:${context.scope}`;

		switch (level) {
			case LogLevel.DEBUG:
				transport.debug({ context }, context.message);
				break;
			case LogLevel.INFO:
				transport.info({ context }, context.message);
				break;
			case LogLevel.WARN:
				transport.warn({ context }, context.message);
				break;
			case LogLevel.ERROR:
				transport.error({ context }, context.message);
				break;
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
