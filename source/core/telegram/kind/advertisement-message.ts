import {IPublishAdvertisementMessage} from "~types/telegram.js";
import {App} from "~application";
import {AzureBlobStorageWrapper} from "~core/blob-storage/wrapper.js";
import {LocalStorageWrapper} from "~core/local-storage/wrapper.js";
import {extractFilename} from "~core/utils/extract-filename.js";

import {CustomFile} from "telegram/client/uploads.js";
import {rootPath} from "~core/utils/root-path.js";
import fs from 'node:fs'

export class PublishAdvertisementMessage {
    public static readonly kind = 'advertisement';

    public readonly azureStorage = new AzureBlobStorageWrapper();
    public readonly localStorage = new LocalStorageWrapper();
    public readonly text: string;
    public readonly media: string;
    public readonly button: { text: string, url: string };

    constructor(options: IPublishAdvertisementMessage) {
        this.text = options.text;
        this.media = options.media;
        this.button = {text: options.button.text, url: options.button.url};
    }

    public async publish(chatId: string) {
        const client = await App.telegram.getClient();

        await this.azureStorage.read(this.media);

        const filename = extractFilename(this.media);
        const filepath = rootPath(`temp/${filename}`);
        const filesize = await fs.promises.stat(filepath);
        const file = new CustomFile(filename, filesize.size, filepath);

        const document = await client.uploadFile({file, workers: 1})

        await client.sendMessage(chatId, {
            file: document,
            message: this.text,
            parseMode: 'html',
        });

        await this.localStorage.delete(this.media);
    }
}
