import { NewMessage, type NewMessageEvent } from "telegram/events/NewMessage.js";
import { TelegramConnectionProvider } from "../connection.js";
import { Logger } from "~core/logger.js";
import { TelegramChannelProvider } from "../channel/class.js";
import { type Peer } from "../channel/types.js";

export class TelegramWatcher {
	private readonly connectionProvider = new TelegramConnectionProvider();
	private readonly channelProvider = new TelegramChannelProvider();
	private readonly logger = new Logger();

	private async onMessage(event: NewMessageEvent): Promise<void> {
		const peer = event.message.peerId as Peer;
		const channel = this.channelProvider.getChannelByPeer(peer);

		if (typeof channel === "undefined") return;

		this.logger.info({
			scope: "TelegramWatcher::onMessage",
			channelId: peer.channelId,
			message: event.message.text,
		});
	}

	public async start(): Promise<void> {
		const client = await this.connectionProvider.getClient();

		client.addEventHandler((event) => {
			if (event.isChannel || event.isGroup) {
				this.onMessage(event);
			}
		}, new NewMessage({}));
	}
}
