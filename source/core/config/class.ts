import { config } from "dotenv";
import { AzureConfigurationLockup } from "./lockup/azure.js";
import { TelegramConfigurationLockup } from "./lockup/telegram.js";
import { ApplicationConfigurationLockup } from "./lockup/application.js";
import { Core } from "~core/namespace.js";

export class Config {
	public static readonly App = new ApplicationConfigurationLockup();
	public static readonly Azure = new AzureConfigurationLockup();
	public static readonly Telegram = new TelegramConfigurationLockup();

	static {
		config({ path: Core.Utils.rootPath(".env") });
	}
}
