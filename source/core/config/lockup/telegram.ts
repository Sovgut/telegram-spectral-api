import { Logger } from "~core/logger/class.js";

export class TelegramConfigurationLockup {
	private readonly logger = new Logger("Config:TelegramConfigurationLockup");

	public get ApiId(): number {
		const apiId = parseInt(String(process.env.TELEGRAM_API_ID), 10);

		if (isNaN(apiId)) {
			this.logger.error({
				scope: "ApiId",
				message: "TELEGRAM_API_ID is required",
			});

			process.exit(1);
		}

		return apiId;
	}

	public get ApiHash(): string {
		const apiHash = process.env.TELEGRAM_API_HASH;

		if (!apiHash) {
			this.logger.error({
				scope: "ApiHash",
				message: "TELEGRAM_API_HASH is required",
			});

			process.exit(1);
		}

		return apiHash;
	}

	public get PhoneNumber(): string {
		const phoneNumber = process.env.TELEGRAM_PHONE_NUMBER;

		if (!phoneNumber) {
			this.logger.error({
				scope: "PhoneNumber",
				message: "TELEGRAM_PHONE_NUMBER is required",
			});

			process.exit(1);
		}

		return phoneNumber;
	}

	public get Password(): string {
		const password = process.env.TELEGRAM_PASSWORD;

		if (!password) {
			this.logger.error({
				scope: "Password",
				message: "TELEGRAM_PASSWORD is required",
			});

			process.exit(1);
		}

		return password;
	}

	public get SessionString(): string {
		const sessionString = process.env.TELEGRAM_SESSION_STRING;

		if (!sessionString) {
			this.logger.error({
				scope: "SessionString",
				message: "TELEGRAM_SESSION_STRING is required",
			});

			process.exit(1);
		}

		return sessionString;
	}

	public get BotToken(): string {
		const botToken = process.env.TELEGRAM_BOT_TOKEN;

		if (!botToken) {
			this.logger.error({
				scope: "BotToken",
				message: "TELEGRAM_BOT_TOKEN is required",
			});

			process.exit(1);
		}

		return botToken;
	}
}
