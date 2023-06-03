import { NewMessage, type NewMessageEvent } from "telegram/events/NewMessage.js";
import { TelegramConnectionProvider } from "../connection.js";
import { Logger } from "~core/logger.js";

export class TelegramWatcher {
	private readonly connectionProvider = new TelegramConnectionProvider();
	private readonly logger = new Logger();

	private async handler(event: NewMessageEvent): Promise<void> {
		const chatId = event.message.peerId as unknown as string;

		this.logger.info({
			scope: "TelegramWatcher:handler",
			message: `Received message from ${chatId}`,
		});
	}

	public async start(): Promise<void> {
		const client = await this.connectionProvider.getClient();

		client.addEventHandler(this.handler, new NewMessage({}));
	}
}
