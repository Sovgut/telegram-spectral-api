import {TelegramPublishProvider} from "~core/telegram/publish.js";

export class PublishTextProvider {
    private telegramPublishProvider = new TelegramPublishProvider();

    public async send(chatId: string, text: string) {
        await this.telegramPublishProvider.publish(chatId, {kind: 'text', text})
    }
}