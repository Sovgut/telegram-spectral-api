export enum LogLevel {
	DEBUG = "debug",
	INFO = "info",
	WARN = "warn",
	ERROR = "error",
}

export const LEVELS_GUARD = {
	[LogLevel.DEBUG]: LogLevel.DEBUG,
	[LogLevel.INFO]: LogLevel.INFO,
	[LogLevel.WARN]: LogLevel.WARN,
	[LogLevel.ERROR]: LogLevel.ERROR,
};

export const DEV_TRANSPORT_OPTIONS = {
	target: "pino-pretty",
	options: {
		colorize: true,
	},
};
