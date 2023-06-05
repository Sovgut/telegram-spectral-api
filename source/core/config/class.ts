import os from "node:os";
import { join } from "node:path";
import { config } from "dotenv";
import { Logger } from "~core/logger.js";

export namespace Config {
	let logger = new Logger();

	export function load(): void {
		const root = process.cwd();
		const path = join(root, ".env");

		config({ path });
		logger = new Logger();

		if (process.env.NODE_ENV === "local") {
			logger.log({
				scope: "config:load",
				message: `Config loaded from .env`,
			});
		}
	}

	export function isLocalBuild(): boolean {
		return process.env.NODE_ENV === "local";
	}

	export function ffmpegPath(): string {
		const variable = process.env["AZ_BATCH_APP_PACKAGE_ffmpeg#5.1.2"] as string;

		if (os.platform() === "win32") {
			return `${variable}\\ffmpeg.exe`;
		}

		return `${variable}/ffmpeg`;
	}

	export function ffprobePath(): string {
		const variable = process.env["AZ_BATCH_APP_PACKAGE_ffprobe#5.1.2"] as string;

		if (os.platform() === "win32") {
			return `${variable}\\ffprobe.exe`;
		}

		return `${variable}/ffprobe`;
	}

	export function telegramBotToken(): string {
		const token = process.env.TELEGRAM_BOT_TOKEN;

		if (!token) {
			logger.error({
				scope: "config:telegramBotToken",
				message: "TELEGRAM_BOT_TOKEN is required",
			});

			process.exit(1);
		}

		return token;
	}

	export function telegramApiId(): number {
		const apiId = parseInt(String(process.env.TELEGRAM_API_ID), 10);

		if (isNaN(apiId)) {
			logger.error({
				scope: "config:telegramApiId",
				message: "TELEGRAM_API_ID is required",
			});

			process.exit(1);
		}

		return apiId;
	}

	export function telegramApiHash(): string {
		const apiHash = process.env.TELEGRAM_API_HASH;

		if (!apiHash) {
			logger.error({
				scope: "config:telegramApiHash",
				message: "TELEGRAM_API_HASH is required",
			});

			process.exit(1);
		}

		return apiHash;
	}

	export function telegramPhoneNumber(): string {
		const phoneNumber = process.env.TELEGRAM_PHONE_NUMBER;

		if (!phoneNumber) {
			logger.error({
				scope: "config:telegramPhoneNumber",
				message: "TELEGRAM_PHONE_NUMBER is required",
			});

			process.exit(1);
		}

		return phoneNumber;
	}

	export function telegramPassword(): string {
		const password = process.env.TELEGRAM_PASSWORD;

		if (!password) {
			logger.error({
				scope: "config:telegramPassword",
				message: "TELEGRAM_PASSWORD is required",
			});

			process.exit(1);
		}

		return password;
	}

	export function telegramSessionString(): string {
		const sessionString = process.env.TELEGRAM_SESSION_STRING;

		if (!sessionString) {
			logger.warn({
				scope: "config:telegramSessionString",
				message: "TELEGRAM_SESSION_STRING is not found.",
			});

			return String();
		}

		return sessionString;
	}

	export function azureStorageConnectionString(): string {
		const connectionString = process.env.AZURE_STORAGE_CONNECTIONSTRING;

		if (!connectionString) {
			logger.error({
				scope: "config:azureStorageConnectionString",
				message: "AZURE_STORAGE_CONNECTIONSTRING string is required",
			});

			process.exit(1);
		}

		return connectionString;
	}

	export function azureStorageContainerName(): string {
		const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

		if (!containerName) {
			logger.error({
				scope: "config:azureStorageContainerName",
				message: "AZURE_STORAGE_CONTAINER_NAME name is required",
			});

			process.exit(1);
		}

		return containerName;
	}

	export function azureStorageAccountName(): string {
		const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;

		if (!accountName) {
			logger.error({
				scope: "config:azureStorageAccountName",
				message: "AZURE_STORAGE_ACCOUNT_NAME name is required",
			});

			process.exit(1);
		}

		return accountName;
	}

	export function appPort(): number {
		const port = parseInt(String(process.env.APP_PORT), 10);

		if (isNaN(port)) {
			logger.error({
				scope: "config:appPort",
				message: "APP_PORT is required",
			});

			process.exit(1);
		}

		return port;
	}

	export function appSecret(): string {
		const secret = process.env.APP_SECRET;

		if (!secret) {
			logger.error({
				scope: "config:appSecret",
				message: "APP_SECRET is required",
			});

			process.exit(1);
		}

		return secret;
	}

	export function databaseConnectionString(): string {
		const connectionString = process.env.AZURE_COSMOS_CONNECTIONSTRING;

		if (!connectionString) {
			logger.error({
				scope: "config:databaseConnectionString",
				message: "AZURE_COSMOS_CONNECTIONSTRING connection string is required",
			});

			process.exit(1);
		}

		return connectionString;
	}
}
