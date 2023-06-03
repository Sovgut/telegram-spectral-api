import { LocalStorage } from "~core/local-storage/provider.js";
import https from "node:https";
import { Core } from "~core/namespace.js";
import { type Attachment, type AttachmentPayload, type TelegramMessageButton } from "~repositories/telegram/types.js";
import FormData from "form-data";
import { type Document } from "~repositories/document/model.js";
import { type ReadStream } from "node:fs";
import { AzureStorage } from "~core/blob-storage/provider.js";
import { StoragePathType } from "~types/blob-storage.js";
import { PhotoProcessing } from "~core/processing/photo.js";
import { Logger } from "~core/logger.js";
import { Config } from "~core/config/class.js";
import { Decorators } from "~core/decorators.js";

export class Telegram {
	private readonly azureStorage = new AzureStorage();
	private readonly localStorage = new LocalStorage();

	private setAttachment(attachment: Attachment): AttachmentPayload {
		const attachmentData: AttachmentPayload = {
			type: attachment.type,
			media: attachment.media,
			caption: attachment.caption,
			parse_mode: attachment.parse_mode,
			thumb: undefined,
		};

		if (typeof attachment.thumbnail !== "undefined") {
			attachmentData.thumb = attachment.thumbnail.label;
		}

		return attachmentData;
	}

	private getAttachment(form: FormData, text: string): (document: Document, index: number) => Promise<Attachment> {
		return async (document: Document, index: number) => {
			await this.azureStorage.read(document.location, StoragePathType.Url);

			const filename = Core.Utils.extractFilename(document.location);
			const stream = await this.localStorage.read(document.location, StoragePathType.Url);
			let thumbnail: { label: string; filename: string; stream: ReadStream } | undefined;

			if (Core.Utils.isVideo(document.mimeType)) {
				const photoProcessing = new PhotoProcessing();
				const thumb = await photoProcessing.getThumbnail(filename);

				thumbnail = {
					label: `attach://thumb-${index}`,
					filename: thumb.filename,
					stream: await this.localStorage.read(thumb.filename, StoragePathType.FileName),
				};

				form.append(`thumb-${index}`, thumbnail.stream);
			}

			form.append(`media-${index}`, stream);

			return {
				stream,
				filename,
				media: `attach://media-${index}`,
				type: Core.Utils.getDocumentType(document.mimeType),
				caption: index === 0 ? text : undefined,
				parse_mode: "HTML",
				thumbnail,
			};
		};
	}

	private async request(form: FormData, options: any, cleanup?: () => Promise<void>): Promise<string> {
		return await new Promise((resolve, reject) => {
			const request = https.request(options, (response) => {
				const chunks: string[] = [];

				response.on("data", (chunk) => chunks.push(chunk.toString()));
				response.on("error", async (error) => {
					if (cleanup != null) await cleanup();

					reject(error);
				});
				response.on("close", async () => {
					if (cleanup != null) await cleanup();

					resolve(chunks.join(""));
				});
			});

			request.on("error", (error) => {
				new Logger().error({
					scope: "Telegram:request",
					message: error?.message,
					exception: error,
				});

				reject(error);
			});

			form.pipe(request);
		});
	}

	@Decorators.Logger("Send message to Telegram")
	async sendMessage(chatId: string, text: string, button?: TelegramMessageButton): Promise<string> {
		const form = new FormData();

		form.append("chat_id", chatId);
		form.append("text", text);
		form.append("parse_mode", "HTML");

		if (button != null) {
			form.append(
				"reply_markup",
				JSON.stringify({
					inline_keyboard: [[button]],
				})
			);
		}

		const options = {
			hostname: "api.telegram.org",
			path: `/bot${Config.telegramBotToken()}/sendMessage`,
			method: "POST",
			headers: form.getHeaders(),
		};

		return await this.request(form, options);
	}

	@Decorators.Logger("Send photo to Telegram")
	async sendPhoto(chatId: string, text: string, document: Document, button?: TelegramMessageButton): Promise<string> {
		const form = new FormData();

		await this.azureStorage.read(document.location, StoragePathType.Url);

		form.append("chat_id", chatId);
		form.append("caption", text);
		form.append("parse_mode", "HTML");
		form.append("photo", await this.localStorage.read(document.location, StoragePathType.Url));

		if (button != null) {
			form.append(
				"reply_markup",
				JSON.stringify({
					inline_keyboard: [[button]],
				})
			);
		}

		const options = {
			hostname: "api.telegram.org",
			path: `/bot${Config.telegramBotToken()}/sendPhoto`,
			method: "POST",
			headers: form.getHeaders(),
		};

		return await this.request(form, options, async () => {
			await this.localStorage.destroy(document.location, StoragePathType.Url);
		});
	}

	@Decorators.Logger("Send video to Telegram")
	async sendVideo(chatId: string, text: string, document: Document, button?: TelegramMessageButton): Promise<string> {
		const form = new FormData();

		await this.azureStorage.read(document.location, StoragePathType.Url);

		form.append("chat_id", chatId);
		form.append("caption", text);
		form.append("parse_mode", "HTML");
		form.append("supports_streaming", "true");
		form.append("video", await this.localStorage.read(document.location, StoragePathType.Url));

		if (button != null) {
			form.append(
				"reply_markup",
				JSON.stringify({
					inline_keyboard: [[button]],
				})
			);
		}

		const options = {
			hostname: "api.telegram.org",
			path: `/bot${Config.telegramBotToken()}/sendVideo`,
			method: "POST",
			headers: form.getHeaders(),
		};

		return await this.request(form, options, async () => {
			await this.localStorage.destroy(document.location, StoragePathType.Url);
		});
	}

	@Decorators.Logger("Send album to Telegram")
	async sendAlbum(chatId: string, text: string, documents: Document[]): Promise<string> {
		const form = new FormData();

		const attachments: Attachment[] = await Promise.all(documents.map(this.getAttachment(form, text)));

		form.append("chat_id", chatId);
		form.append("media", JSON.stringify(attachments.map(this.setAttachment)));

		const options = {
			hostname: "api.telegram.org",
			path: `/bot${Config.telegramBotToken()}/sendMediaGroup`,
			method: "POST",
			headers: form.getHeaders(),
		};

		return await this.request(form, options, async () => {
			await Promise.all(
				attachments.map(async (document) => {
					await this.localStorage.destroy(document.filename, StoragePathType.FileName);

					if (document.thumbnail != null) {
						await this.localStorage.destroy(document.thumbnail.filename, StoragePathType.FileName);
					}
				})
			);
		});
	}
}
