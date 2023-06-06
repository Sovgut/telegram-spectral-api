import { config } from "dotenv";
import { Logger } from "~core/logger/class.js";
import { AzureConfigurationLockup } from "./lockup/azure.js";
import { TelegramConfigurationLockup } from "./lockup/telegram.js";
import { ApplicationConfigurationLockup } from "./lockup/application.js";
import { Core } from "~core/namespace.js";

export class Config {
	private static readonly logger = new Logger();

	public static readonly Azure = new AzureConfigurationLockup();
	public static readonly Telegram = new TelegramConfigurationLockup();
	public static readonly App = new ApplicationConfigurationLockup();

	static {
		config({ path: Core.Utils.rootPath(".env") });
	}
}
