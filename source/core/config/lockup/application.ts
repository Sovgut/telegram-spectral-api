import { Logger } from "~core/logger/class.js";

const DEFAULT_PORT = 8080;
const DEFAULT_ENVIRONMENT = "local";
const DEFAULT_LOG_LEVEL = "warn";
const DEFAULT_HOST = "0.0.0.0";

export class ApplicationConfigurationLockup {
	private readonly logger = new Logger("Config:ApplicationConfigurationLockup");

	public get Port(): number {
		const port = parseInt(String(process.env.PORT), 10);

		if (isNaN(port)) {
			this.logger.warn({
				scope: "Port",
				message: `PORT is missing. Using default port "${DEFAULT_PORT}"`,
			});

			return DEFAULT_PORT;
		}

		return port;
	}

	public get Host(): string {
		const host = process.env.HOST;

		if (!host) {
			this.logger.warn({
				scope: "Host",
				message: `HOST is missing. Using default host ${DEFAULT_HOST}`,
			});

			return DEFAULT_HOST;
		}

		return host;
	}

	public get Secret(): string {
		const secret = process.env.APP_SECRET;

		if (!secret) {
			this.logger.error({
				scope: "Secret",
				message: "APP_SECRET is required",
			});

			process.exit(1);
		}

		return secret;
	}

	public get Environment(): string {
		const environment = process.env.NODE_ENV;

		if (!environment) {
			this.logger.warn({
				scope: "Environment",
				message: `NODE_ENV is missing. Using default environment "${DEFAULT_ENVIRONMENT}"`,
			});

			return DEFAULT_ENVIRONMENT;
		}

		return environment;
	}

	public get LogLevel(): string {
		const logLevel = process.env.LOG_LEVEL;

		if (!logLevel) {
			this.logger.warn({
				scope: "LogLevel",
				message: `LOG_LEVEL is missing. Using default log level "${DEFAULT_LOG_LEVEL}"`,
			});

			return DEFAULT_LOG_LEVEL;
		}

		return logLevel;
	}
}
