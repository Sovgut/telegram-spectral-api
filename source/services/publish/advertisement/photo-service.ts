import {AzureBlobStorageWrapper} from "~core/blob-storage/wrapper.js";
import {LocalStorageWrapper} from "~core/local-storage/wrapper.js";
import {IButton, IDocument} from "~types/entities.js";
import {App} from "~application";

export class PublishAdvertisementPhotoService {
    private azureStorage: AzureBlobStorageWrapper;
    private localStorage: LocalStorageWrapper;

    constructor() {
        this.azureStorage = new AzureBlobStorageWrapper();
        this.localStorage = new LocalStorageWrapper();
    }

    public async send(chatId: string, text: string, document: IDocument, button: IButton) {
        await this.azureStorage.read(document.url);
        const fileStream = await this.localStorage.read(document.url);

        await App.bot.telegram.sendPhoto(chatId, {source: fileStream}, {
            caption: text,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [[
                    {text: button.text, url: button.url},
                ]]
            }
        });

        await this.localStorage.delete(document.url);
        await this.azureStorage.delete(document.url);
    }
}