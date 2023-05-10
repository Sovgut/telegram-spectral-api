import {AzureBlobStorageWrapper} from "~core/blob-storage/wrapper.js";
import {LocalStorageWrapper} from "~core/local-storage/wrapper.js";
import {IButton, IDocument} from "~types/entities.js";
import {App} from "~application";
import {LocalStorageProvider} from "~core/local-storage/provider.js";

export class PublishAdvertisementVideoService {
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

        const telegramFile = await App.bot.telegram.sendVideo(chatId, {source: fileStream}, {disable_notification: true})
        await App.bot.telegram.deleteMessage(chatId, telegramFile.message_id)

        await App.bot.telegram.sendVideo(chatId, telegramFile.video.file_id, {
            caption: text,
            thumb: telegramFile.video.thumb?.file_id as any,
            width: telegramFile.video.width,
            height: telegramFile.video.height,
            parse_mode: 'HTML',
            disable_notification: false,
            reply_markup: {
                inline_keyboard: [[
                    {text: button.text, url: button.url},
                ]]
            }
        });

        await this.localStorage.delete(document.url);
    }
}