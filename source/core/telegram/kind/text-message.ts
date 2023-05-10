import {IPublishTextMessage} from "~types/telegram.js";
import {App} from "~application";

export class PublishTextMessage {
    public static readonly kind = 'text';

    public readonly text: string;

    constructor(options: IPublishTextMessage) {
        this.text = options.text;
    }

    public async publish(chatId: string) {
        const client = await App.telegram.getClient();

        await client.sendMessage(chatId, {message: this.text, parseMode: 'html'});
    }
}