import { TelegramConnectionProvider } from "../connection.js";
import { Decorators } from "~core/decorators.js";
import { Peer, type ChannelEntity } from "./types.js";
import { type IChannel } from "~database/models/channel.js";
import { ChannelService } from "~services/channels/class.js";
import { type IMongooseMeta } from "~types/entities.js";

export class TelegramChannelProvider {
	private readonly connectionProvider = new TelegramConnectionProvider();
	private readonly channelService = new ChannelService();

	@Decorators.Logger("Searching channel by peer")
	public async getChannelByPeer(peer?: Peer): Promise<IChannel & IMongooseMeta> {
		if (typeof peer?.channelId === "undefined") {
			throw new Error("Peer is not a channel");
		}

		return await this.channelService.read(peer.channelId.toString());
	}

	@Decorators.Logger("Searching channels in CosmosDB")
	public async getCosmosChannels(): Promise<Array<IChannel & IMongooseMeta>> {
		const channels = await this.channelService.list();

		return channels;
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
