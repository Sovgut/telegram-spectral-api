import {AzureBlobStorageWrapper} from "~core/blob-storage/wrapper.js";
import {LocalStorageWrapper} from "~core/local-storage/wrapper.js";
import {LocalStorageProvider} from "~core/local-storage/provider.js";
import {VideoInput} from "../../../models/video-input.js";
import {PhotoInput} from "../../../models/photo-input.js";
import {IDocument, IPhotoInputOptions, IVideoInputOptions} from "~types/entities.js";
import {extractFilename} from "~core/utils/extract-filename.js";
import {extractThumbnail} from "~core/local-storage/extract-thumbnail.js";
import {nanoid} from "nanoid";
import {App} from "~application";
import {Types} from "telegraf";

export class PublishMediaGroupProvider {
    private azureStorage: AzureBlobStorageWrapper;
    private localStorage: LocalStorageWrapper;
    private localStorageProvider: LocalStorageProvider;
    protected attachments: Array<VideoInput | PhotoInput> = []

    constructor() {
        this.azureStorage = new AzureBlobStorageWrapper();
        this.localStorage = new LocalStorageWrapper();
        this.localStorageProvider = new LocalStorageProvider();
    }

    protected getCaption(text: string) {
        if (this.attachments.length === 0) {
            return text;
        }

        return undefined;
    }

    protected async clear() {
        for (const attachment of this.attachments) {
            if (attachment instanceof VideoInput) {
                if (typeof attachment.thumb === 'string') {
                    await this.localStorageProvider.delete(attachment.thumb);
                }

                if (typeof attachment.thumb === 'object') {
                    await this.localStorageProvider.delete(attachment.thumb.filename);
                }
            }

            await this.localStorageProvider.delete(attachment.media.filename);
        }
    }

    public async attachVideo(text: string, document: IDocument) {
        await this.azureStorage.read(document.url);
        const fileStream = this.localStorage.read(document.url);
        const filename = extractFilename(document.url);
        const thumbnail = await extractThumbnail(filename, nanoid());
        const thumbnailStream = this.localStorageProvider.read(thumbnail.filename);
        const thumbnailUploaded = await this.azureStorage.write(thumbnailStream);
        await this.localStorageProvider.delete(thumbnail.filename);

        const videoOptions: IVideoInputOptions = {
            media: {source: fileStream, filename},
            thumb: thumbnailUploaded.url,
            height: thumbnail.height,
            width: thumbnail.width,
            caption: this.getCaption(text),
        }

        this.attachments.push(new VideoInput(videoOptions))
    }

    public async attachPhoto(text: string, document: IDocument) {
        await this.azureStorage.read(document.url);
        const fileStream = this.localStorage.read(document.url);
        const filename = extractFilename(document.url);

        const photoOptions: IPhotoInputOptions = {
            media: {source: fileStream, filename},
            caption: this.getCaption(text),
        }

        this.attachments.push(new PhotoInput(photoOptions))
    }

    public async prepare(text: string, documents: IDocument[]) {
        for (const document of documents) {
            if (document.type === 'video') {
                await this.attachVideo(text, document);
            }

            if (document.type === 'photo') {
                await this.attachPhoto(text, document);
            }
        }
    }

    public async send(chatId: string) {
        await App.bot.telegram.sendMediaGroup(chatId, this.attachments as Types.MediaGroup);
        await this.clear();
    }
}