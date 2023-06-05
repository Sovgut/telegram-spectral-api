import fs from "node:fs";
import { nanoid } from "nanoid";
import { NewMessage, type NewMessageEvent } from "telegram/events/NewMessage.js";
import { TelegramConnectionProvider } from "../connection.js";
import { Logger } from "~core/logger.js";
import { TelegramChannelProvider } from "../channel/class.js";
import { type Peer } from "../channel/types.js";
import { Decorators } from "~core/decorators.js";
import { invokeWebhook } from "~core/http/invoke-webhook.js";
import { Core } from "~core/namespace.js";
import { LocalStorage } from "~core/local-storage/provider.js";
import { AzureStorage } from "~core/blob-storage/provider.js";
import { PhotoProcessing } from "~core/processing/photo.js";
import { VideoProcessing } from "~core/processing/video.js";
import { DocumentService } from "~services/documents/class.js";
import { WebhookService } from "~services/webhooks/class.js";
import { type IDocument, ReadonlyDocument, StorageAzure, StorageTelegram } from "~database/models/document.js";
import { type IMongooseMeta } from "~types/entities.js";
import { StoragePathType } from "~types/blob-storage.js";
import { NotFoundError } from "~core/errors/not-found.js";

export class TelegramWatcher {
	private readonly connectionProvider = new TelegramConnectionProvider();
	private readonly channelProvider = new TelegramChannelProvider();
	private readonly documentService = new DocumentService();
	private readonly webhookService = new WebhookService();
	private readonly photoProcessing = new PhotoProcessing();
	private readonly videoProcessing = new VideoProcessing();
	private readonly localStorage = new LocalStorage();
	private readonly azureStorage = new AzureStorage();
	private readonly logger = new Logger();

	private async onMessage(event: NewMessageEvent): Promise<void> {
		try {
			const peer = event.message.peerId as Peer;
			const channel = await this.channelProvider.getChannelByPeer(peer);
			const webhook = await this.webhookService.read(channel._id.toHexString());
			const media: Array<IDocument & IMongooseMeta> = [];

			if (event.message.document !== undefined && event.message.document.mimeType !== "image/gif") {
				const filename = nanoid();
				const filepath = Core.Utils.rootPath(`temp/${filename}`);
				await event.message.downloadMedia({ outputFile: filepath });

				const filesize = (await fs.promises.stat(filepath)).size;
				const filestream = await this.localStorage.read(filepath, StoragePathType.FilePath);
				const uploadedPhoto = await this.azureStorage.write(filestream, { mimeType: "image/gif", fileName: filename });

				const document = await this.documentService.create({
					name: filename,
					channel: channel._id,
					size: filesize,
					mimeType: "image/gif",
					location: uploadedPhoto.url,
					flags: ReadonlyDocument | StorageTelegram | StorageAzure,
				});

				await this.localStorage.destroy(filepath);

				media.push(document);
			}

			if (event.message.photo !== undefined) {
				const filename = nanoid();
				const filepath = Core.Utils.rootPath(`temp/${filename}`);
				await event.message.downloadMedia({ outputFile: filepath });

				const optimizedPhoto = await this.photoProcessing.optimize(filepath, Core.Utils.rootPath(`temp/${filename}.jpg`));
				const filesize = (await fs.promises.stat(optimizedPhoto)).size;
				const filestream = await this.localStorage.read(optimizedPhoto, StoragePathType.FilePath);
				const uploadedPhoto = await this.azureStorage.write(filestream, { mimeType: "image/jpeg", fileName: filename });

				const document = await this.documentService.create({
					name: filename,
					channel: channel._id,
					size: filesize,
					mimeType: "image/jpeg",
					location: uploadedPhoto.url,
					flags: ReadonlyDocument | StorageTelegram | StorageAzure,
				});

				await this.localStorage.destroy(optimizedPhoto);

				media.push(document);
			}

			if (event.message.document !== undefined && event.message.document.mimeType === "video/mp4") {
				const filename = nanoid();
				const filepath = Core.Utils.rootPath(`temp/${filename}`);
				await event.message.downloadMedia({ outputFile: filepath });

				const optimizedVideo = await this.videoProcessing.optimize(filepath, Core.Utils.rootPath(`temp/${filename}.mp4`));
				const filesize = (await fs.promises.stat(optimizedVideo)).size;
				const filestream = await this.localStorage.read(optimizedVideo, StoragePathType.FilePath);
				const uploadedPhoto = await this.azureStorage.write(filestream, { mimeType: "video/mp4", fileName: filename });

				const document = await this.documentService.create({
					name: filename,
					channel: channel._id,
					size: filesize,
					mimeType: "video/mp4",
					location: uploadedPhoto.url,
					flags: ReadonlyDocument | StorageTelegram | StorageAzure,
				});

				await this.localStorage.destroy(optimizedVideo);

				media.push(document);
			}

			await this.logger.info({
				scope: "TelegramWatcher::onMessage",
				channelId: peer.channelId,
				message: event.message.text,
				groupId: event.message.groupedId?.toString(),
				media,
			});

			await invokeWebhook(webhook, {
				channelId: channel._id,
				message: event.message.text,
				groupId: event.message.groupedId?.toString(),
				media,
			});
		} catch (error) {
			if (!(error instanceof NotFoundError) && error instanceof Error) {
				await this.logger.error({
					scope: "TelegramWatcher::start",
					message: "Error while processing message",
					exception: {
						message: error.message,
						stack: error.stack,
					},
				});
			}
		}
	}

	@Decorators.Logger("Watching for new messages...")
	public async start(): Promise<void> {
		const client = await this.connectionProvider.getClient();

		client.addEventHandler((event) => {
			if (event.isChannel ?? event.isGroup) {
				this.onMessage(event);
			}
		}, new NewMessage({}));
	}
}
