import { Logger } from "~core/logger.js";
import { TelegramWatcher } from "~core/telegram/watcher/class.js";

export const onServerStart = async (error: Error | null, address: string): Promise<void> => {
	const logger = new Logger();
	const telegramWatcher = new TelegramWatcher();

	if (error !== null) {
		await logger.error({
			scope: "http:hooks:onServerStart",
			message: error?.message,
			exception: error,
		});

		process.exit(1);
	}

	await logger.info({
		scope: "http:hooks:onServerStart",
		message: `Listening on ${address}`,
	});

	await telegramWatcher.start();
};
