import {IAttachment, IMedia, IPublishMediaGroupMessage} from "~types/telegram.js";
import {App} from "~application";
import {AzureBlobStorageWrapper} from "~core/blob-storage/wrapper.js";
import {LocalStorageWrapper} from "~core/local-storage/wrapper.js";
import {LocalStorageProvider} from "~core/local-storage/provider.js";
import {extractFilename} from "~core/utils/extract-filename.js";
import {rootPath} from "~core/utils/root-path.js";
import {VideoFileSizeLimit} from "~core/constants.js";
import {extractThumbnail} from "~core/local-storage/extract-thumbnail.js";

import fs from 'node:fs'
import FormData from "form-data";
import {Environment} from "~core/config.js";
import https from 'node:https'

export class PublishMediaGroupMessage {
    public static readonly kind = 'mediaGroup';

    public readonly azureStorage = new AzureBlobStorageWrapper();
    public readonly localStorage = new LocalStorageWrapper();
    public readonly localStorageProvider = new LocalStorageProvider();
    public readonly text: string;
    public readonly media: IMedia[];

    constructor(options: IPublishMediaGroupMessage) {
        this.text = options.text;
        this.media = options.media;
    }

    private getCaption(text: string, attachments: IAttachment[]) {
        if (attachments.length === 0) {
            return text;
        }

        return undefined;
    }

    private async clear(attachments: IAttachment[]) {
        for (const attachment of attachments) {
            const filename = attachment.filename;
            const thumbnail = filename.replace('.mp4', '.jpg')

            await this.localStorageProvider.delete(filename);

            if (fs.existsSync(rootPath(`temp/${thumbnail}`))) {
                await this.localStorageProvider.delete(thumbnail);
            }
        }
    }

    private mimeType(type: 'photo' | 'video') {
        switch (type) {
            case 'photo':
                return 'image/jpeg';
            case 'video':
                return 'video/mp4';
        }
    }

    private async downloadAttachments(text: string, documents: IMedia[]) {
        const attachments: IAttachment[] = [];

        for await (const document of documents) {
            await this.azureStorage.read(document.url);

            const filename = extractFilename(document.url);
            const filepath = rootPath(`temp/${filename}`);

            attachments.push({
                filename,
                filepath,
                caption: this.getCaption(text, attachments),
                mimeType: this.mimeType(document.type),
                type: document.type,
            })
        }

        return attachments;
    }

    private async isVideoTooBig(attachment: IAttachment) {
        const filesize = await fs.promises.stat(attachment.filepath);

        return attachment.mimeType === 'video/mp4' && filesize.size > VideoFileSizeLimit;
    }

    private async createThumbnail(attachment: IAttachment) {
        if (!await this.isVideoTooBig(attachment)) {
            return undefined;
        }

        return await extractThumbnail(attachment.filename, attachment.filename.replace('.mp4', ''));
    }

    public async publish(chatId: string) {
        const attachments = await this.downloadAttachments(this.text, this.media);

        const form = new FormData();

        form.append('chat_id', chatId);
        form.append('media', JSON.stringify(attachments.map((attachment, index) => ({
            type: attachment.type,
            media: `attach://media-${index}`,
            caption: index === 0 ? attachment.caption : undefined,
            parse_mode: 'HTML',

            ...(attachment.type === 'video' ? {
                thumb: `attach://thumb-${index}`
            } : {})
        }))))

        for (const [index, attachment] of attachments.entries()) {
            if (attachment.type === 'video') {
                const thumbnail = await this.createThumbnail(attachment);

                if (thumbnail) {
                    form.append(`thumb-${index}`, fs.createReadStream(rootPath(`temp/${thumbnail.filename}`)));
                }
            }

            form.append(`media-${index}`, fs.createReadStream(attachment.filepath));
        }

        const options = {
            method: 'POST',
            host: 'api.telegram.org',
            path: `/bot${Environment.telegramBotToken}/sendMediaGroup`,
            headers: form.getHeaders(),
        }

        const response = await new Promise((resolve, reject) => {
            const chunks: string[] = [];
            let body: unknown | null = null;

            const request = https.request(options, (response) => {
                response.on('end', () => {
                    body = JSON.parse(chunks.join(''));
                })
                response.on('error', (error) => {
                    reject(error)
                });
                response.on('data', (chunk) => {
                    chunks.push(chunk);
                });
            });

            form.pipe(request);

            request.on('error', (error) => {
                App.server.log.error(error);
                reject(error);
            });

            request.on('close', () => {
                resolve(body)
            })
        });

        await this.clear(attachments);

        return response;
    }
}
