import {TelegramPublishProvider} from "~core/telegram/publish.js";
import {IMedia} from "~types/telegram.js";

export class PublishMediaGroupProvider {
    private readonly telegramPublishProvider = new TelegramPublishProvider();

    public async send(chatId: string, text: string, media: IMedia[]) {
        await this.telegramPublishProvider.publish(chatId, {kind: 'mediaGroup', media, text});
    }
}