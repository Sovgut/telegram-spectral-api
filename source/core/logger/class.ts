import { pino, type TransportSingleOptions, type TransportMultiOptions, type TransportPipelineOptions } from "pino";
import { LogLevel } from "./constants.js";
import { type LoggerContext } from "./types.js";

export class Logger {
	private readonly transport = pino({
		level: (process.env.LOG_LEVEL as LogLevel)?.toLowerCase() ?? LogLevel.DEBUG,
		transport: this.createTransport(),
	});

	private createTransport(): TransportSingleOptions | TransportMultiOptions | TransportPipelineOptions | undefined {
		if (process.env.NODE_ENV === "production") {
			return undefined;
		}

		return {
			target: "pino-pretty",
			options: {
				colorize: true,
			},
		};
	}

	private commit(context: LoggerContext, level: LogLevel): void {
		context.timestamp = new Date().toISOString();

		switch (level) {
			case LogLevel.DEBUG:
				this.transport.debug({ context }, context.message);
				break;
			case LogLevel.INFO:
				this.transport.info({ context }, context.message);
				break;
			case LogLevel.WARN:
				this.transport.warn({ context }, context.message);
				break;
			case LogLevel.ERROR:
				this.transport.error({ context }, context.message);
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
