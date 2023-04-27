import {AzureBlobStorageWrapper} from "~core/blob-storage/wrapper.js";
import {LocalStorageWrapper} from "~core/local-storage/wrapper.js";
import {IButton, IDocument} from "~types/entities.js";
import {App} from "~application";
import {extractFilename} from "~core/utils/extract-filename.js";
import {extractThumbnail} from "~core/local-storage/extract-thumbnail.js";
import {nanoid} from "nanoid";
import {LocalStorageProvider} from "~core/local-storage/provider.js";

export class AdvertisementVideoService {
    private azureStorage: AzureBlobStorageWrapper;
    private localStorage: LocalStorageWrapper;
    private localStorageProvider: LocalStorageProvider;

    constructor() {
        this.azureStorage = new AzureBlobStorageWrapper();
        this.localStorage = new LocalStorageWrapper();
        this.localStorageProvider = new LocalStorageProvider();
    }

    public async send(chatId: string, text: string, document: IDocument, button: IButton) {
        await this.azureStorage.read(document.url);
        const fileStream = await this.localStorage.read(document.url);
        
        const filename = extractFilename(document.url);
        const thumbnail = await extractThumbnail(filename, nanoid());
        const thumbStream = this.localStorageProvider.read(thumbnail.filename);

        await App.bot.telegram.sendVideo(chatId, {source: fileStream}, {
            caption: text,
            thumb: {source: thumbStream},
            width: thumbnail.width,
            height: thumbnail.height,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [[
                    {text: button.text, url: button.url},
                ]]
            }
        });

        await this.localStorageProvider.delete(thumbnail.filename);
        await this.localStorage.delete(document.url);
        await this.azureStorage.delete(document.url);
    }
}