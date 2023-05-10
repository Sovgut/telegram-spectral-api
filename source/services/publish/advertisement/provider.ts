import {IButton, IDocument} from "~types/entities.js";
import {TelegramPublishProvider} from "~core/telegram/publish.js";

export class PublishAdvertisementProvider {
    private telegramPublishProvider = new TelegramPublishProvider();

    public async send(chatId: string, text: string, document: IDocument, button: IButton) {
        await this.telegramPublishProvider.publish(chatId, {
            text,
            button,
            kind: 'advertisement',
            media: document.url,
        })
    }
}