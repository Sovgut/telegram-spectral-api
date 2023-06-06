import { Logger as TelegramLogger, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/StringSession.js";
import inquirer from "inquirer";
import { LogLevel } from "telegram/extensions/Logger.js";
import { Logger } from "~core/logger/class.js";
import { Config } from "~core/config/class.js";

export class TelegramConnectionProvider {
	private readonly stringSession: StringSession = new StringSession(Config.Telegram.SessionString);
	private readonly client: TelegramClient = new TelegramClient(this.stringSession, Config.Telegram.ApiId, Config.Telegram.ApiHash, {
		appVersion: "1.0.0",
		deviceModel: "SpectralAPI",
		langCode: "en",
		connectionRetries: 5,
		requestRetries: 1,
		baseLogger: new TelegramLogger(LogLevel.ERROR),
	});

	private isConnected(): boolean {
		return typeof this.client !== "undefined" && this.client.connected === true;
	}

	public async getClient(): Promise<TelegramClient> {
		if (this.isConnected()) {
			return this.client;
		}

		await this.client.connect();
		await this.client.getMe();

		return this.client;
	}

	public async createSessionString(): Promise<void> {
		const logger = new Logger();

		await this.client.start({
			phoneNumber: async () => Config.Telegram.PhoneNumber,
			password: async () => Config.Telegram.Password,
			phoneCode: async () => {
				const { code } = await inquirer.prompt<{ code: number }>([
					{
						type: "number",
						name: "code",
						message: "Enter the code you received: ",
					},
				]);

				return code.toString();
			},
			onError: (err) => console.log(err),
		});

		const sessionString = this.stringSession.save() as unknown as string;

		await logger.info({
			scope: "TelegramConnectionProvider:createSessionString",
			message: `You should now be connected. Store this session string into TELEGRAM_SESSION_STRING: ${sessionString}`,
		});
		await this.client.sendMessage("me", { message: "Connected" });
	}
}
