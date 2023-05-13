import {LocalStorage} from "~core/local-storage/provider.js";
import https from "node:https";
import {Core} from "~core/namespace.js";
import {TelegramMessageButton} from "~repositories/telegram/types.js";
import FormData from "form-data";
import {Document} from "~repositories/document/model.js";
import {createThumbnail} from "~core/processing/thumbnail/create-thumbnail.js";
import internal from "node:stream";
import {AzureStorage} from "~core/blob-storage/provider.js";

export class Telegram {
    private static async request(form: FormData, options: any, cleanup?: () => Promise<void>): Promise<string> {
        return await new Promise((resolve, reject) => {
            const request = https.request(options, (response) => {
                const chunks: string[] = [];

                response.on('data', (chunk) => chunks.push(chunk.toString()));
                response.on('error', async (error) => {
                    if (cleanup) await cleanup();

                    reject(error)
                });
                response.on('close', async () => {
                    if (cleanup) await cleanup();

                    resolve(chunks.join(''))
                });
            });

            request.on('error', (error) => {
                Core.Logger.error('Telegram', error.message)

                reject(error);
            });

            form.pipe(request);
        });
    }

    static async sendMessage(chatId: string, text: string, button?: TelegramMessageButton): Promise<string> {
        const form = new FormData();

        form.append('chat_id', chatId);
        form.append('text', text);
        form.append('parse_mode', 'HTML');

        if (button) {
            form.append('reply_markup', JSON.stringify({
                inline_keyboard: [[button]],
            }));
        }

        const options = {
            hostname: 'api.telegram.org',
            path: `/bot${Core.Environment.telegramBotToken}/sendMessage`,
            method: 'POST',
            headers: form.getHeaders(),
        }

        return await Telegram.request(form, options);
    }

    static async sendPhoto(chatId: string, text: string, document: Document, button?: TelegramMessageButton): Promise<string> {
        const form = new FormData();

        await AzureStorage.read(document.location, AzureStorage.StoragePathType.Url);

        form.append('chat_id', chatId);
        form.append('caption', text);
        form.append('parse_mode', 'HTML');
        form.append('photo', await LocalStorage.read(document.location, LocalStorage.StoragePathType.Url));

        if (button) {
            form.append('reply_markup', JSON.stringify({
                inline_keyboard: [[button]],
            }));
        }

        const options = {
            hostname: 'api.telegram.org',
            path: `/bot${Core.Environment.telegramBotToken}/sendPhoto`,
            method: 'POST',
            headers: form.getHeaders(),
        };

        return await Telegram.request(form, options, async () => {
            await LocalStorage.delete(document.location, LocalStorage.StoragePathType.Url);
        });
    }

    static async sendVideo(chatId: string, text: string, document: Document, button?: TelegramMessageButton): Promise<string> {
        const form = new FormData();

        await AzureStorage.read(document.location, AzureStorage.StoragePathType.Url);

        form.append('chat_id', chatId);
        form.append('caption', text);
        form.append('parse_mode', 'HTML');
        form.append('supports_streaming', 'true')
        form.append('video', await LocalStorage.read(document.location, LocalStorage.StoragePathType.Url));

        if (button) {
            form.append('reply_markup', JSON.stringify({
                inline_keyboard: [[button]],
            }));
        }

        const options = {
            hostname: 'api.telegram.org',
            path: `/bot${Core.Environment.telegramBotToken}/sendVideo`,
            method: 'POST',
            headers: form.getHeaders(),
        };

        return await Telegram.request(form, options, async () => {
            await LocalStorage.delete(document.location, LocalStorage.StoragePathType.Url);
        });
    }

    static async sendMediaGroup(chatId: string, text: string, documents: Document[]): Promise<string> {
        const form = new FormData();

        const attachments = await Promise.all(documents.map(async (document, index) => {
            await AzureStorage.read(document.location, AzureStorage.StoragePathType.Url);

            const filename = Core.Utils.extractFilename(document.location);
            const stream = await LocalStorage.read(document.location, LocalStorage.StoragePathType.Url);
            let thumbnail: { label: string, filename: string, stream: internal.Readable } | undefined = undefined;

            if (Core.Utils.isVideo(document.mimeType)) {
                const thumb = await createThumbnail(filename)

                thumbnail = {
                    label: `attach://thumb-${index}`,
                    filename: thumb.filename,
                    stream: await LocalStorage.read(thumb.filename, LocalStorage.StoragePathType.FileName),
                }

                form.append(`thumb-${index}`, thumbnail.stream);
            }

            return {
                stream,
                filename,
                media: `attach://media-${index}`,
                type: Core.Utils.getDocumentType(document.mimeType),
                caption: index === 0 ? text : undefined,
                parse_mode: 'HTML',
                thumbnail: thumbnail,
            }
        }));

        form.append('chat_id', chatId);
        form.append('media', JSON.stringify(attachments.map((document: any) => ({
            type: document.type,
            media: document.media,
            caption: document.caption,
            parse_mode: document.parse_mode,
            ...(document.thumbnail ? {
                thumb: document.thumbnail.label,
            } : {}),
        }))));

        attachments.forEach((attachment, index) => {
            form.append(`media-${index}`, attachment.stream);
        });

        const options = {
            hostname: 'api.telegram.org',
            path: `/bot${Core.Environment.telegramBotToken}/sendMediaGroup`,
            method: 'POST',
            headers: form.getHeaders(),
        };

        return await Telegram.request(form, options, async () => {
            await Promise.all(attachments.map(async (document) => {
                await LocalStorage.delete(document.filename, LocalStorage.StoragePathType.FileName);

                if (document.thumbnail) {
                    await LocalStorage.delete(document.thumbnail.filename, LocalStorage.StoragePathType.FileName);
                }
            }));
        });
    }
}