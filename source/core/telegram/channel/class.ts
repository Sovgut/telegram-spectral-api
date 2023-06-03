import { TelegramConnectionProvider } from "../connection.js";
import { Decorators } from "~core/decorators.js";
import { Peer, type ChannelEntity } from "./types.js";
import { Channel } from "~repositories/channel/model.js";

export class TelegramChannelProvider {
	private readonly connectionProvider = new TelegramConnectionProvider();

	@Decorators.Logger("Searching channel by peer")
	public async getChannelByPeer(peer?: Peer): Promise<Channel | undefined> {
		if (typeof peer?.channelId === "undefined") return;

		try {
			return await Channel.findOne({ reference: peer.channelId.toString() });
		} catch {}
	}

	@Decorators.Logger("Searching channels in CosmosDB")
	public async getCosmosChannels(): Promise<Channel[]> {
		try {
			const [channels] = await Channel.findMany({ limit: Number.MAX_SAFE_INTEGER, offset: 0 });

			return channels;
		} catch {
			return [];
		}
	}

	@Decorators.Logger("Searching channels in Telegram")
	public async getTelegramChannels(): Promise<ChannelEntity[]> {
		const client = await this.connectionProvider.getClient();
		const channels: ChannelEntity[] = [];

		for await (const dialog of client.iterDialogs()) {
			if (dialog.isChannel && typeof dialog.entity !== "undefined") {
				const entity = dialog.entity as ChannelEntity;

				channels.push({ id: entity.id, username: entity.username, title: entity.title });
			}
		}

		return channels;
	}
}
